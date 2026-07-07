/**
 * Auth API — maps to /api/auth/ endpoints on the Django backend
 */

import { apiRequest, setTokens } from "./client";

// ---------- types ----------

export type Role = "citizen" | "officer" | "worker" | "admin";

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  phone: string | null;
  role: Role;
  preferred_language: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  username: string;
  role: Role;
}

export interface RegisterPayload {
  username: string;
  password: string;
  email?: string;
  phone?: string;
  preferred_language?: string;
}

// ---------- api functions ----------

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const data = await apiRequest<LoginResponse>("/api/auth/login/", {
    method: "POST",
    body: payload,
    auth: false,
  });
  // persist tokens so every subsequent request is authenticated
  setTokens(data.access, data.refresh);
  // store basic user info for quick access
  localStorage.setItem(
    "cp_user",
    JSON.stringify({ username: data.username, role: data.role })
  );
  return data;
}

export async function register(payload: RegisterPayload): Promise<AuthUser> {
  return apiRequest<AuthUser>("/api/auth/register/", {
    method: "POST",
    body: payload,
    auth: false,
  });
}

export async function getProfile(): Promise<AuthUser> {
  return apiRequest<AuthUser>("/api/auth/profile/");
}

/** Returns the stored user from localStorage (no network call) */
export function getCachedUser(): { username: string; role: Role } | null {
  try {
    const raw = localStorage.getItem("cp_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
