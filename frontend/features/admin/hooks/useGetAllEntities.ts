import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-client";
import { useQuery } from "@tanstack/react-query";
import { APIResponse } from "@/types";
import { Entities } from "@/types";
import { useAuthContext } from "@/providers/AuthProvider";

export const useGetAllEntities = () => {
  const { user } = useAuthContext();
  return useQuery({
    queryKey: queryKeys.entities,
    queryFn: async () => {
      const response = await api.get<APIResponse<Entities>>(`/entities`);
      return response.data;
    },
    enabled: !!user?._id,
  });
};
