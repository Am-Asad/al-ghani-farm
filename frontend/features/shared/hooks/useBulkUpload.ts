import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export type BulkUploadConfig<T, R> = {
  endpoint: string;
  queryKey: string[];
  entityName: string;
  transformData?: (data: T[]) => R[];
  successMessage?: (count: number) => string;
  errorMessage?: string;
  loadingMessage?: string;
};

export function useBulkUpload<T, R = T>(config: BulkUploadConfig<T, R>) {
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: () => {
      const message =
        config.loadingMessage || `Creating ${config.entityName}s in bulk...`;
      toast.loading(message, { id: `bulkUpload${config.entityName}` });
    },
    mutationFn: async (data: T[]) => {
      const transformedData = config.transformData
        ? config.transformData(data)
        : (data as unknown as R[]);
      const response = await api.post(
        `/${config.endpoint}/bulk`,
        transformedData
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      const count = variables.length;
      const message = config.successMessage
        ? config.successMessage(count)
        : `Successfully created ${count} ${config.entityName}${
            count > 1 ? "s" : ""
          }`;

      toast.success(message, { id: `bulkUpload${config.entityName}` });
      queryClient.invalidateQueries({ queryKey: config.queryKey });
    },
    onError: (error) => {
      const errorMessage =
        config.errorMessage ||
        (error instanceof AxiosError
          ? error.response?.data?.error?.message ||
            error.response?.data?.message
          : `Failed to create ${config.entityName}s`);

      toast.error(errorMessage, { id: `bulkUpload${config.entityName}` });
    },
  });
}
