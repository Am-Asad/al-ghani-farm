"use client";
import React, { useEffect } from "react";
import { useGetAllUsers } from "@/features/admin/users/hooks/useUserHooks";
import UsersPageSkeleton from "@/features/admin/users/components/UsersPageSkeleton";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import { Users } from "lucide-react";
import DataNotFound from "@/features/shared/components/DataNotFound";
import UsersTable from "@/features/admin/users/components/UsersTable";
import UsersHeader from "@/features/admin/users/components/UsersHeader";
import ConfigurableFilters from "@/features/shared/components/ConfigurableFilters";
import { ENTITY_FILTER_PRESETS } from "@/features/shared/utils/filterPresets";
import Pagination from "@/features/shared/components/Pagination";
import { useUserQueryParams } from "@/features/admin/users/hooks/useUserQueryParams";
import { useAuthContext } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

const UsersPage = () => {
  const { user } = useAuthContext();
  const router = useRouter();
  const isViewer = user?.role === "viewer";

  const queryParams = useUserQueryParams();
  const { query, setPage, setLimit } = queryParams;
  const { data, isLoading, isError, error } = useGetAllUsers(query);

  const users = data?.data || [];
  const pagination = data?.pagination ?? {
    page: 1,
    limit: 1,
    totalCount: 0,
    hasMore: false,
  };

  useEffect(() => {
    if (isViewer) {
      router.push("/dashboard");
    }
  }, [isViewer, router]);

  if (isLoading) {
    return <UsersPageSkeleton />;
  }

  if (isError) {
    return (
      <div className="p-6 overflow-hidden flex flex-col flex-1 space-y-6">
        <ErrorFetchingData
          title="Users"
          description="Manage system users and their permissions"
          buttonText="Add User"
          error={error?.message || "Failed to load users"}
        />
      </div>
    );
  }

  return (
    <div className="p-6 overflow-y-scroll flex flex-col flex-1 space-y-6">
      {/* Users header */}
      <UsersHeader showActions={true} />
      {/* Filters */}
      <ConfigurableFilters
        config={ENTITY_FILTER_PRESETS.USERS}
        queryParams={queryParams}
      />
      {/* Table */}
      <div className="flex-1 pb-1 my-4">
        {users.length > 0 ? (
          <UsersTable users={users} />
        ) : (
          <DataNotFound title="users" icon={<Users className="w-10 h-10" />} />
        )}
      </div>
      <Pagination
        page={pagination.page}
        limit={pagination.limit}
        hasMore={pagination.hasMore}
        onChangePage={setPage}
        onChangeLimit={setLimit}
      />
    </div>
  );
};

export default UsersPage;
