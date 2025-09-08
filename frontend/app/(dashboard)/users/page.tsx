"use client";
import React, { useState } from "react";
import { useGetAllUsers } from "@/features/users/hooks/useGetAllUsers";
import CardsSkeleton from "@/features/shared/components/CardsSkeleton";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import { Users } from "lucide-react";
import DataNotFound from "@/features/shared/components/DataNotFound";
import UserCard from "@/features/users/components/UserCard";
import UsersHeader from "@/features/users/components/UsersHeader";

const UsersPage = () => {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError, error } = useGetAllUsers();

  if (isLoading) {
    return <CardsSkeleton />;
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

  const users = data?.data || [];
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="p-6 overflow-hidden flex flex-col flex-1 space-y-6">
      {/* Page header */}
      <UsersHeader
        search={search}
        setSearch={setSearch}
        totalUsers={users.length}
      />

      {/* Users grid */}
      {filteredUsers.length > 0 ? (
        <div className="flex-1 overflow-y-scroll grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <UserCard key={user._id} user={user} />
          ))}
        </div>
      ) : (
        <DataNotFound title="users" icon={<Users className="w-10 h-10" />} />
      )}
    </div>
  );
};

export default UsersPage;
