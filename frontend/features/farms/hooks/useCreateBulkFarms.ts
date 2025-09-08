import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query-client";
import { Farm as FarmType } from "@/types/farm-types";
import { FarmRecord } from "@/utils/csv-parser";

type BulkCreateFarmsData = Pick<
  FarmType,
  "name" | "supervisor" | "totalSheds"
>[];

type BulkCreateResponse = {
  status: "success" | "error";
  message: string;
  data: FarmType[];
};

export const useCreateBulkFarms = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: () => {
      toast.loading("Creating farms in bulk...", { id: "createBulkFarms" });
    },
    mutationFn: async (farmsData: BulkCreateFarmsData) => {
      const response = await api.post<BulkCreateResponse>(
        "/farms/bulk",
        farmsData
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      const count = variables.length;
      toast.success(
        `Successfully created ${count} farm${count > 1 ? "s" : ""}`,
        { id: "createBulkFarms" }
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.farms });
    },
    onError: (error) => {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error?.message ||
            error.response?.data?.message
          : "Failed to create farms";

      toast.error(errorMessage, { id: "createBulkFarms" });
    },
  });
};

// Helper function to convert FarmRecord to API format
export function convertFarmRecordsToAPI(
  farmRecords: FarmRecord[]
): BulkCreateFarmsData {
  return farmRecords.map((record) => ({
    name: record.name,
    supervisor: record.supervisor,
    totalSheds: record.totalSheds,
  }));
}
