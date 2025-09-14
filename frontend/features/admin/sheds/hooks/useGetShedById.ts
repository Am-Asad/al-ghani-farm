import { queryKeys } from "@/lib/query-client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { APIResponse, Shed } from "@/types";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useAuthContext } from "@/providers/AuthProvider";

export const useGetShedById = (shedId: string) => {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: queryKeys.shedById(shedId),
    queryFn: async () => {
      try {
        const response = await api.get<APIResponse<Shed>>(`/sheds/${shedId}`);
        return response.data;
      } catch (error) {
        toast.error(
          error instanceof AxiosError
            ? error.response?.data?.error?.message
            : "Failed to fetch shed",
          { id: "getShedById" }
        );
      }
    },
    enabled: !!shedId && !!user?._id,
  });
};
