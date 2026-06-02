// Static mock data for CivicPulse — never mutated, never persisted.
export type Role = "citizen" | "officer" | "worker" | "admin";

export type ComplaintCategory =
  | "roads"
  | "water"
  | "garbage"
  | "electricity"
  | "drainage"
  | "safety";

export type ComplaintStatus =
  | "submitted"
  | "assigned"
  | "in_progress"
  | "resolved"
  | "rejected";

export type ComplaintPriority = "low" | "medium" | "high" | "emergency";

export interface TimelineEntry {
  status: ComplaintStatus | "received" | "under_review";
  time: string;
  note: string;
  officer?: string;
}

export interface Complaint {
  id: string;
  title: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  description: string;
  location: { lat: number; lng: number; address: string };
  upvotes: number;
  media: string[];
  createdAt: string;
  assignedOfficer: string | null;
  department?: string;
  citizen?: string;
  timeline: TimelineEntry[];
  rating?: number;
}

export const mockComplaints: Complaint[] = [
  {
    id: "CMP-2024-001",
    title: "Large pothole near City Hospital",
    category: "roads",
    status: "in_progress",
    priority: "high",
    description:
      "Dangerous 2-foot pothole causing accidents near City Hospital junction. Three two-wheeler accidents reported in the last week. Needs immediate filling.",
    location: { lat: 22.3072, lng: 73.1812, address: "RC Dutt Road, Vadodara" },
    upvotes: 47,
    media: [],
    createdAt: "2024-01-15T09:30:00",
    assignedOfficer: "Rajesh Kumar",
    department: "Roads & Infrastructure",
    citizen: "Priya Sharma",
    timeline: [
      { status: "submitted", time: "2024-01-15T09:30", note: "Complaint registered" },
      { status: "received", time: "2024-01-15T10:15", note: "Acknowledged by control room" },
      { status: "assigned", time: "2024-01-15T11:00", note: "Assigned to Roads Department", officer: "Rajesh Kumar" },
      { status: "in_progress", time: "2024-01-16T08:00", note: "Field team dispatched on site", officer: "Suresh Patel" },
    ],
  },
  {
    id: "CMP-2024-002",
    title: "Street light out for 3 days",
    category: "electricity",
    status: "submitted",
    priority: "medium",
    description:
      "Street light at Alkapuri garden not working since 3 days. Area becomes unsafe after sunset for evening walkers.",
    location: { lat: 22.3217, lng: 73.1851, address: "Alkapuri, Vadodara" },
    upvotes: 12,
    media: [],
    createdAt: "2024-01-17T18:45:00",
    assignedOfficer: null,
    department: "Electricity",
    citizen: "Anand Joshi",
    timeline: [
      { status: "submitted", time: "2024-01-17T18:45", note: "Complaint registered" },
    ],
  },
  {
    id: "CMP-2024-003",
    title: "EMERGENCY: Gas leak near school",
    category: "safety",
    status: "assigned",
    priority: "emergency",
    description:
      "Strong smell of gas near Bright Future School. Children at risk. Requires immediate fire & safety inspection.",
    location: { lat: 22.3156, lng: 73.1923, address: "Fatehgunj, Vadodara" },
    upvotes: 89,
    media: [],
    createdAt: "2024-01-18T08:15:00",
    assignedOfficer: "Emergency Unit",
    department: "Public Safety",
    citizen: "Anonymous",
    timeline: [
      { status: "submitted", time: "2024-01-18T08:15", note: "Emergency complaint filed" },
      { status: "assigned", time: "2024-01-18T08:17", note: "Auto-routed to Emergency Unit", officer: "Emergency Unit" },
    ],
  },
  {
    id: "CMP-2024-004",
    title: "Overflowing garbage bin near market",
    category: "garbage",
    status: "resolved",
    priority: "medium",
    description: "Bin near Sayajigunj market has not been cleared for 4 days. Strong smell, attracting stray animals.",
    location: { lat: 22.3009, lng: 73.2081, address: "Sayajigunj Market, Vadodara" },
    upvotes: 31,
    media: [],
    createdAt: "2024-01-10T07:00:00",
    assignedOfficer: "Neha Desai",
    department: "Sanitation",
    citizen: "Priya Sharma",
    rating: 5,
    timeline: [
      { status: "submitted", time: "2024-01-10T07:00", note: "Complaint registered" },
      { status: "assigned", time: "2024-01-10T09:20", note: "Assigned to Sanitation", officer: "Neha Desai" },
      { status: "in_progress", time: "2024-01-11T07:30", note: "Cleaning crew dispatched" },
      { status: "resolved", time: "2024-01-11T11:15", note: "Bin cleared & sanitized" },
    ],
  },
  {
    id: "CMP-2024-005",
    title: "Water leakage on main pipeline",
    category: "water",
    status: "in_progress",
    priority: "high",
    description: "Continuous water leakage at Race Course Circle wasting thousands of litres daily.",
    location: { lat: 22.3128, lng: 73.1738, address: "Race Course Circle, Vadodara" },
    upvotes: 64,
    media: [],
    createdAt: "2024-01-14T11:20:00",
    assignedOfficer: "Mehul Trivedi",
    department: "Water Works",
    citizen: "Priya Sharma",
    timeline: [
      { status: "submitted", time: "2024-01-14T11:20", note: "Complaint registered" },
      { status: "assigned", time: "2024-01-14T13:00", note: "Assigned to Water Works", officer: "Mehul Trivedi" },
      { status: "in_progress", time: "2024-01-15T09:00", note: "Excavation in progress" },
    ],
  },
  {
    id: "CMP-2024-006",
    title: "Clogged drainage flooding lane",
    category: "drainage",
    status: "resolved",
    priority: "high",
    description: "Heavy rain caused drain block. Lane completely flooded.",
    location: { lat: 22.3199, lng: 73.1655, address: "Karelibaug, Vadodara" },
    upvotes: 22,
    media: [],
    createdAt: "2024-01-08T06:40:00",
    assignedOfficer: "Anjali Rao",
    department: "Drainage",
    citizen: "Anand Joshi",
    rating: 4,
    timeline: [
      { status: "submitted", time: "2024-01-08T06:40", note: "Complaint registered" },
      { status: "assigned", time: "2024-01-08T08:00", note: "Assigned to Drainage", officer: "Anjali Rao" },
      { status: "in_progress", time: "2024-01-08T11:00", note: "De-silting started" },
      { status: "resolved", time: "2024-01-09T15:30", note: "Drain cleared, water receded" },
    ],
  },
  {
    id: "CMP-2024-007",
    title: "Broken footpath tiles",
    category: "roads",
    status: "submitted",
    priority: "low",
    description: "Several footpath tiles broken near bus stand causing tripping hazard.",
    location: { lat: 22.3045, lng: 73.181, address: "Vadodara Central Bus Stand" },
    upvotes: 8,
    media: [],
    createdAt: "2024-01-19T14:10:00",
    assignedOfficer: null,
    department: "Roads & Infrastructure",
    citizen: "Priya Sharma",
    timeline: [{ status: "submitted", time: "2024-01-19T14:10", note: "Complaint registered" }],
  },
  {
    id: "CMP-2024-008",
    title: "Frequent power cuts in evening",
    category: "electricity",
    status: "assigned",
    priority: "medium",
    description: "Daily 2 hour power cut between 6-8pm in Manjalpur for last 2 weeks.",
    location: { lat: 22.2722, lng: 73.1849, address: "Manjalpur, Vadodara" },
    upvotes: 41,
    media: [],
    createdAt: "2024-01-17T20:10:00",
    assignedOfficer: "Vikram Shah",
    department: "Electricity",
    citizen: "Anand Joshi",
    timeline: [
      { status: "submitted", time: "2024-01-17T20:10", note: "Complaint registered" },
      { status: "assigned", time: "2024-01-18T09:30", note: "Assigned to Electricity", officer: "Vikram Shah" },
    ],
  },
];

export const mockStats = {
  totalComplaints: 12847,
  resolvedThisMonth: 1284,
  avgResolutionDays: 4.2,
  satisfactionRating: 4.1,
  pendingComplaints: 89,
  emergencyActive: 3,
  activeToday: 284,
  totalCitizens: 8432,
  activeOfficers: 34,
  slaBreachRate: 4.2,
};

export const mockUser = {
  citizen: {
    id: "USR-001",
    name: "Priya Sharma",
    email: "priya@example.com",
    phone: "+91 98765 43210",
    avatar: null as string | null,
    role: "citizen" as Role,
    complaintsSubmitted: 8,
    resolvedCount: 6,
    upvotesGiven: 34,
    joinedDate: "2023-08-15",
    city: "Vadodara",
    language: "English",
  },
  officer: {
    id: "OFF-001",
    name: "Rajesh Kumar",
    department: "Roads & Infrastructure",
    email: "rajesh.kumar@vadodara.gov.in",
    role: "officer" as Role,
    assignedComplaints: 23,
    resolvedThisMonth: 18,
  },
  worker: {
    id: "WRK-001",
    name: "Suresh Patel",
    department: "Roads",
    role: "worker" as Role,
    tasksAssigned: 5,
    tasksCompleted: 3,
  },
  admin: {
    id: "ADM-001",
    name: "Commissioner V. Mehta",
    role: "admin" as Role,
    email: "admin@civicpulse.gov.in",
  },
};

export interface NotificationItem {
  id: number;
  type: "status_change" | "resolved" | "upvote" | "emergency" | "system";
  title: string;
  body: string;
  time: string;
  read: boolean;
  complaintId?: string;
}

export const mockNotifications: NotificationItem[] = [
  {
    id: 1,
    type: "status_change",
    title: "Complaint Updated",
    body: "Your complaint CMP-2024-001 is now In Progress",
    time: "2 hours ago",
    read: false,
    complaintId: "CMP-2024-001",
  },
  {
    id: 2,
    type: "resolved",
    title: "Complaint Resolved 🎉",
    body: "CMP-2024-004 has been resolved. Rate your experience.",
    time: "Yesterday",
    read: false,
    complaintId: "CMP-2024-004",
  },
  {
    id: 3,
    type: "upvote",
    title: "Community Support",
    body: "12 citizens upvoted your complaint",
    time: "2 days ago",
    read: true,
    complaintId: "CMP-2024-001",
  },
  {
    id: 4,
    type: "emergency",
    title: "Emergency Alert in Your Area",
    body: "Gas leak reported near Fatehgunj. Stay alert.",
    time: "3 days ago",
    read: true,
    complaintId: "CMP-2024-003",
  },
  {
    id: 5,
    type: "system",
    title: "Welcome to CivicPulse",
    body: "Thank you for joining. Report your first issue.",
    time: "1 week ago",
    read: true,
  },
];

export const mockTestimonials = [
  {
    name: "Anand Joshi",
    area: "Alkapuri, Vadodara",
    quote:
      "Reported a pothole in the morning, repaired by next afternoon. I never thought civic complaints could move this fast.",
    type: "Roads",
  },
  {
    name: "Meera Patel",
    area: "Sayajigunj",
    quote: "The before/after photos give me confidence the work was actually done. Much better than calling helplines.",
    type: "Sanitation",
  },
  {
    name: "Rohit Desai",
    area: "Karelibaug",
    quote: "Drainage issue resolved in 2 days during monsoon. The timeline updates kept me informed every step.",
    type: "Drainage",
  },
];

export const mockDepartmentPerf = [
  { dept: "Roads & Infrastructure", total: 412, resolved: 364, pending: 32, avgDays: 3.4, sla: 92, rating: 4.2 },
  { dept: "Water Works", total: 318, resolved: 295, pending: 18, avgDays: 2.8, sla: 96, rating: 4.4 },
  { dept: "Sanitation", total: 287, resolved: 251, pending: 24, avgDays: 1.9, sla: 94, rating: 4.3 },
  { dept: "Electricity", total: 198, resolved: 162, pending: 28, avgDays: 4.1, sla: 86, rating: 3.9 },
  { dept: "Drainage", total: 141, resolved: 118, pending: 19, avgDays: 5.6, sla: 78, rating: 3.6 },
  { dept: "Public Safety", total: 86, resolved: 80, pending: 4, avgDays: 0.8, sla: 99, rating: 4.7 },
];

export const mockWorkers = [
  { id: "WRK-001", name: "Suresh Patel", tasks: 5, available: true, dept: "Roads" },
  { id: "WRK-002", name: "Imran Sheikh", tasks: 8, available: true, dept: "Roads" },
  { id: "WRK-003", name: "Kavita Iyer", tasks: 3, available: false, dept: "Roads" },
  { id: "WRK-004", name: "Mehul Trivedi", tasks: 6, available: true, dept: "Water" },
];

export const mockUsers = [
  { id: "USR-001", name: "Priya Sharma", role: "citizen", status: "active", complaints: 8, joined: "Aug 2023" },
  { id: "USR-002", name: "Anand Joshi", role: "citizen", status: "active", complaints: 12, joined: "May 2023" },
  { id: "USR-003", name: "Meera Patel", role: "citizen", status: "active", complaints: 4, joined: "Jan 2024" },
  { id: "OFF-001", name: "Rajesh Kumar", role: "officer", status: "active", complaints: 156, joined: "Mar 2022" },
  { id: "OFF-002", name: "Anjali Rao", role: "officer", status: "active", complaints: 141, joined: "Jun 2022" },
  { id: "WRK-001", name: "Suresh Patel", role: "worker", status: "active", complaints: 87, joined: "Sep 2022" },
  { id: "WRK-002", name: "Imran Sheikh", role: "worker", status: "active", complaints: 64, joined: "Nov 2022" },
  { id: "ADM-001", name: "V. Mehta", role: "admin", status: "active", complaints: 0, joined: "Jan 2022" },
];

// Daily complaint trend (30 days, generated deterministically)
export const mockDailyTrend = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const v = 30 + Math.round(20 * Math.sin(i / 3) + 15 * Math.cos(i / 5) + (i % 7 === 0 ? 12 : 0));
  return { day: `Jan ${day}`, complaints: v, resolved: Math.max(5, v - 8 - (i % 5)) };
});

export const mockResolutionTrend = mockDailyTrend.slice(-7).map((d) => ({ day: d.day, resolutionRate: 60 + Math.round((d.resolved / d.complaints) * 30) }));

export const mockCategoryDistribution = [
  { name: "Roads", value: 412, key: "roads" },
  { name: "Water", value: 318, key: "water" },
  { name: "Garbage", value: 287, key: "garbage" },
  { name: "Electricity", value: 198, key: "electricity" },
  { name: "Drainage", value: 141, key: "drainage" },
  { name: "Safety", value: 86, key: "safety" },
];

export const mockStatusDistribution = [
  { name: "Resolved", value: 1284, key: "resolved" },
  { name: "In Progress", value: 423, key: "in_progress" },
  { name: "Assigned", value: 218, key: "assigned" },
  { name: "Submitted", value: 89, key: "submitted" },
  { name: "Rejected", value: 24, key: "rejected" },
];
