import { useEffect, useState, useCallback } from "react";
import type { Role } from "@/data/mockData";

const STORAGE_KEY = "civicpulse_role";

export function useRole() {
  const [role, setRoleState] = useState<Role>(() => {
    if (typeof window === "undefined") return "citizen";
    const v = window.localStorage.getItem(STORAGE_KEY);
    return (v === "officer" || v === "worker" || v === "admin" || v === "citizen") ? v : "citizen";
  });

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, role); } catch { /* noop */ }
  }, [role]);

  const setRole = useCallback((r: Role) => setRoleState(r), []);
  return { role, setRole };
}

export function dashboardPathForRole(role: Role): string {
  switch (role) {
    case "citizen": return "/citizen/dashboard";
    case "officer": return "/officer/dashboard";
    case "worker":  return "/worker/dashboard";
    case "admin":   return "/admin/dashboard";
  }
}
