const rolePermissions = {
  admin: new Set(["*"]),
  staff: new Set([
    "auth.reset",
    "master.read",
    "master.write",
    "schedule.generate",
    "schedule.read",
    "schedule.publish",
    "attendance.read",
    "reports.read",
  ]),
  teacher: new Set([
    "auth.reset",
    "attendance.input",
    "attendance.read",
    "schedule.read",
  ]),
};

export function authorize(requiredPermission) {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role) {
      return res.status(403).json({ message: "Role missing" });
    }
    const permissions = rolePermissions[role];
    if (!permissions) {
      return res.status(403).json({ message: "Role not allowed" });
    }
    if (permissions.has("*") || permissions.has(requiredPermission)) {
      return next();
    }
    return res.status(403).json({ message: "Permission denied" });
  };
}

export function getRolePermissions() {
  return rolePermissions;
}
