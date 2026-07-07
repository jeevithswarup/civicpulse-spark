/**
 * Complaints API — maps to /api/complaints/ endpoints on the Django backend
 */

import { apiRequest } from "./client";

// ---------- types ----------

export type ComplaintStatus =
  | "pending"
  | "assigned"
  | "in_progress"
  | "resolved"
  | "closed";

export type ComplaintCategory = "road" | "water" | "electricity" | "sanitation";
export type ComplaintPriority = "low" | "medium" | "high" | "emergency";

export interface Complaint {
  id: number;
  complaintID: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  address: string;
  latitude: string;
  longitude: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  support_count: number;
  worker_notes: string;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  createdBy: number;
  assignedOfficer: number | null;
  assignedWorker: number | null;
  department: number | null;
  resolution_image: string | null;
}

export interface CreateComplaintPayload {
  title: string;
  description: string;
  category: ComplaintCategory;
  address: string;
  latitude: number | string;
  longitude: number | string;
  priority?: ComplaintPriority;
}

export interface CitizenDashboardData {
  my_complaints: number;
  resolved: number;
  pending: number;
}

export interface OfficerDashboardData {
  total: number;
  pending: number;
  in_progress: number;
  resolved: number;
}

export interface WorkerDashboardData {
  assigned: number;
  in_progress: number;
  resolved: number;
}

export interface AdminDashboardData {
  total_complaints: number;
  pending: number;
  resolved: number;
  users: number;
}

// ---------- Citizen ----------

export async function createComplaint(
  payload: CreateComplaintPayload
): Promise<Complaint> {
  return apiRequest<Complaint>("/api/complaints/createcomplaint/", {
    method: "POST",
    body: payload,
  });
}

export async function getMyComplaints(): Promise<Complaint[]> {
  return apiRequest<Complaint[]>("/api/complaints/my/");
}

export async function updateComplaint(
  id: number,
  payload: Partial<CreateComplaintPayload>
): Promise<Complaint> {
  return apiRequest<Complaint>(`/api/complaints/updatecomplaint/${id}/`, {
    method: "PATCH",
    body: payload,
  });
}

export async function deleteComplaint(id: number): Promise<void> {
  return apiRequest<void>(`/api/complaints/deletecomplaint/${id}/`, {
    method: "DELETE",
  });
}

export async function getCitizenDashboard(): Promise<CitizenDashboardData> {
  return apiRequest<CitizenDashboardData>("/api/complaints/citizen-dashboard/");
}

export async function supportComplaint(id: number): Promise<void> {
  return apiRequest<void>(`/api/complaints/complaints/${id}/support/`, {
    method: "POST",
  });
}

export async function getPopularComplaints(): Promise<Complaint[]> {
  return apiRequest<Complaint[]>("/api/complaints/popular-complaints/");
}

export async function getNearbyComplaints(
  lat: number,
  lon: number
): Promise<Complaint[]> {
  return apiRequest<Complaint[]>("/api/complaints/nearby-complaints/", {
    params: { lat, lon },
  });
}

// ---------- Officer ----------

export async function getOfficerDashboard(): Promise<OfficerDashboardData> {
  return apiRequest<OfficerDashboardData>("/api/complaints/officer/dashboard/");
}

export async function getOfficerComplaints(): Promise<Complaint[]> {
  return apiRequest<Complaint[]>("/api/complaints/officers-complaints/");
}

export async function assignOfficer(
  complaintId: number,
  officerId: number
): Promise<Complaint> {
  return apiRequest<Complaint>(
    `/api/complaints/assign-officer/${complaintId}/`,
    { method: "PATCH", body: { assignedOfficer: officerId } }
  );
}

export async function updateComplaintStatus(
  complaintId: number,
  status: ComplaintStatus
): Promise<Complaint> {
  return apiRequest<Complaint>("/api/complaints/status-update/", {
    method: "PATCH",
    body: { id: complaintId, status },
  });
}

export async function getDepartmentWorkers(): Promise<unknown[]> {
  return apiRequest<unknown[]>("/api/complaints/officer/workers/");
}

// ---------- Worker ----------

export async function getWorkerDashboard(): Promise<WorkerDashboardData> {
  return apiRequest<WorkerDashboardData>("/api/complaints/worker-dashboard/");
}

export async function getWorkerComplaints(): Promise<Complaint[]> {
  return apiRequest<Complaint[]>("/api/complaints/worker-complaints/");
}

export async function assignWorker(
  complaintId: number,
  workerId: number
): Promise<Complaint> {
  return apiRequest<Complaint>(
    `/api/complaints/assign-worker/${complaintId}/`,
    { method: "PATCH", body: { assignedWorker: workerId } }
  );
}

export async function workerUpdateComplaint(
  id: number,
  payload: { status?: ComplaintStatus; worker_notes?: string }
): Promise<Complaint> {
  return apiRequest<Complaint>(`/api/complaints/complaint-update/${id}/`, {
    method: "PATCH",
    body: payload,
  });
}

export async function getWorkerComplaintDetail(id: number): Promise<Complaint> {
  return apiRequest<Complaint>(`/api/complaints/worker/complaints/${id}/`);
}

// ---------- Admin ----------

export async function getAdminDashboard(): Promise<AdminDashboardData> {
  return apiRequest<AdminDashboardData>("/api/complaints/admin-dashboard/");
}
