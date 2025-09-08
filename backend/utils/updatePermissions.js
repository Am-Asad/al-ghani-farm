export function updatePermissions(role) {
  const resources = [
    "farms",
    "ledgers",
    "reports",
    "users",
    "vehicles",
    "brokers",
  ];

  switch (role) {
    case "admin":
      // Admin gets all permissions for all resources
      return resources.map((resource) => ({
        resource,
        actions: ["create", "read", "update", "delete"],
      }));

    case "manager":
      // Manager gets create, read, and update permissions for all resources
      return resources.map((resource) => ({
        resource,
        actions: ["create", "read", "update"],
      }));

    case "viewer":
      // Viewer gets only read permissions for all resources
      return resources.map((resource) => ({
        resource,
        actions: ["read"],
      }));

    default:
      // Default to viewer permissions for unknown roles
      return resources.map((resource) => ({
        resource,
        actions: ["read"],
      }));
  }
}
