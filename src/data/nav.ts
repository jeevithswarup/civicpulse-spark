import {
  Home, FileText, PlusCircle, Map, Bell, User,
  LayoutDashboard, ClipboardList, Users, BarChart3, Settings,
  HardHat, Shield,
} from "lucide-react";
import type { NavItem } from "@/components/civic/AppShell";

export const citizenNav: NavItem[] = [
  { to: "/citizen/dashboard", label: "Dashboard", icon: Home, exact: true },
  { to: "/citizen/complaints", label: "My Complaints", icon: FileText },
  { to: "/citizen/report", label: "Report Issue", icon: PlusCircle },
  { to: "/citizen/nearby", label: "Nearby", icon: Map },
  { to: "/citizen/notifications", label: "Notifications", icon: Bell, badge: 2 },
  { to: "/citizen/profile", label: "Profile", icon: User },
];

export const officerNav: NavItem[] = [
  { to: "/officer/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/officer/complaints", label: "Complaints", icon: ClipboardList },
  { to: "/officer/analytics", label: "Analytics", icon: BarChart3 },
];

export const workerNav: NavItem[] = [
  { to: "/worker/dashboard", label: "My Tasks", icon: HardHat, exact: true },
];

export const adminNav: NavItem[] = [
  { to: "/admin/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export { Shield };
