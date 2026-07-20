<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:6366f1,50:8b5cf6,100:06b6d4&height=220&section=header&text=CivicPulse&fontSize=60&fontColor=ffffff&fontAlignY=38&desc=Your%20Voice%20Moves%20Cities%20%F0%9F%8F%99%EF%B8%8F&descAlignY=58&descSize=20&animation=fadeIn" width="100%"/>

<br/>

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![TanStack Router](https://img.shields.io/badge/TanStack_Router-1.x-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)](https://tanstack.com/router)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)

<br/>

> **CivicPulse** is a real-time civic complaint management platform — citizens report issues, officers manage resolution pipelines, workers close tasks in the field, all tracked transparently from submission to fix.

<br/>

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=18&pause=1000&color=6366F1&center=true&vCenter=true&width=600&lines=Role-based+dashboards+for+4+user+types;Real-time+complaint+tracking+%F0%9F%93%8D;JWT+auth+with+automatic+token+refresh;20%2B+live+API+endpoints+connected;Built+with+React+19+%2B+TanStack+Router" alt="Typing SVG" />

<br/><br/>

</div>

---

## 🌟 What is CivicPulse?

CivicPulse bridges the gap between citizens and city government. You see a pothole, a broken streetlight, or overflowing garbage — you report it in seconds. The system routes it to the right department, assigns an officer, dispatches a field worker, and notifies you every step of the way.

**No more calling helplines. No more wondering if anyone noticed.**

---

## ✨ Feature Highlights

<table>
<tr>
<td width="50%">

### 🟦 Citizen Portal
- 📝 File complaints with category, priority, photos
- 📍 GPS-based location detection
- 🔄 Real-time status tracking (pending → resolved)
- 👍 Community upvote / support system
- 🗺️ View nearby issues on map
- 🔔 Status change notifications
- 👤 Profile management with language preference

</td>
<td width="50%">

### 🟧 Officer Dashboard
- 📊 Live stats — total, in-progress, resolved
- 📋 Full complaint management table
- 🔍 Search + filter by status, category, priority
- 👷 Assign workers from department
- ✅ Bulk status updates
- 📈 Analytics charts (coming soon)

</td>
</tr>
<tr>
<td width="50%">

### 🟩 Worker App
- ✅ Active task list with priorities
- 📌 GPS check-in on site
- 🔄 Mark in-progress / resolved
- 📸 Upload resolution proof
- 📝 Add field work notes

</td>
<td width="50%">

### 🟥 Admin Console
- 🌐 Platform-wide overview
- 👥 User management across all roles
- ⚙️ SLA configuration per priority
- 🏢 Department routing settings
- 📊 City-wide analytics (coming soon)

</td>
</tr>
</table>

---

## 🏗️ Project Structure

```
civicpulse-spark/
│
├── src/
│   ├── routes/                    # File-based routing (TanStack Router)
│   │   ├── login.tsx              # Login page — all 4 roles
│   │   ├── register.tsx           # 3-step citizen registration
│   │   │
│   │   ├── citizen.dashboard.tsx  # Citizen home + stats
│   │   ├── citizen.report.tsx     # File a new complaint (4-step wizard)
│   │   ├── citizen.complaints.tsx # My complaints with delete
│   │   ├── citizen.complaints.$id.tsx  # Complaint detail + timeline
│   │   ├── citizen.nearby.tsx     # Nearby issues map view
│   │   ├── citizen.notifications.tsx   # Notification feed
│   │   ├── citizen.profile.tsx    # Profile + logout
│   │   │
│   │   ├── officer.dashboard.tsx  # Officer stats + assign workers
│   │   ├── officer.complaints.tsx # Complaint management table
│   │   ├── officer.analytics.tsx  # Charts and trends
│   │   │
│   │   ├── worker.dashboard.tsx   # Active task list
│   │   ├── worker.tasks.$id.tsx   # Task detail + actions
│   │   │
│   │   ├── admin.dashboard.tsx    # Platform overview
│   │   ├── admin.analytics.tsx    # City-wide analytics
│   │   ├── admin.users.tsx        # User management
│   │   └── admin.settings.tsx     # SLA + department settings
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts          # Base fetch client + JWT handling
│   │   │   ├── auth.ts            # login, register, getProfile
│   │   │   └── complaints.ts      # All 20+ complaint API functions
│   │   ├── formatters.ts          # timeAgo, initials, formatDate
│   │   └── utils.ts               # Tailwind cn helper
│   │
│   ├── components/civic/          # Reusable UI components
│   │   ├── AppShell.tsx           # Sidebar + nav layout
│   │   ├── ComplaintCard.tsx      # Complaint summary card
│   │   ├── StatusBadge.tsx        # Color-coded status pill
│   │   ├── PriorityBadge.tsx      # Priority indicator
│   │   ├── StatCard.tsx           # Dashboard metric card
│   │   ├── MapPlaceholder.tsx     # Map with complaint pins
│   │   └── ...
│   │
│   ├── data/
│   │   ├── nav.ts                 # Role-specific navigation configs
│   │   ├── categories.ts          # Complaint categories + icons
│   │   └── mockData.ts            # Fallback data while loading
│   │
│   └── hooks/
│       ├── useRole.ts             # Role state + dashboard routing
│       └── useTheme.ts            # Light/dark theme
│
├── vite.config.ts                 # Vite + proxy config
├── .env                           # VITE_API_URL (empty = use proxy)
└── .env.example                   # Template for setup
```

---

## 🔌 API Integration

All API communication goes through `src/lib/api/client.ts`:

```
Browser Request
    │
    ▼
Vite Dev Proxy (/api/*)
    │
    ▼
Django Backend (localhost:8000)
    │
    ▼
JSON Response
    │
    ▼
React State Update → UI re-renders
```

### Authentication Flow
```
1. POST /api/auth/login/
   ← { access_token (15min), refresh_token (7d), username, role }

2. Every request → Authorization: Bearer <access_token>

3. On 401 → POST /api/auth/token/refresh/ → retry

4. On unrecoverable 401 → clearTokens() → redirect /login
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- The **[civicpulse-backend](https://github.com/jeevithswarup/civicpulse-backend)** running on port 8000

### Installation

```bash
# 1. Clone
git clone https://github.com/jeevithswarup/civicpulse-spark.git
cd civicpulse-spark

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# VITE_API_URL is empty by default — Vite proxy handles routing

# 4. Start dev server
npm run dev
```

Frontend runs at **`http://localhost:5173`**

> ⚡ The Vite proxy automatically forwards all `/api/*` requests to `localhost:8000` — no CORS issues in development.

### Quick Start (both servers)

```bash
# Terminal 1 — Backend
cd civicpulse-backend
python manage.py runserver

# Terminal 2 — Frontend
cd civicpulse-spark
npm run dev
```

Then open `http://localhost:5173` 🎉

---

## 🧩 Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 19 + TypeScript 5.8 |
| **Routing** | TanStack Router (file-based, SSR-ready) |
| **Styling** | Tailwind CSS 4.x + shadcn/ui |
| **Charts** | Recharts |
| **Forms** | react-hook-form + Zod |
| **Icons** | Lucide React |
| **Notifications** | Sonner (toast) |
| **Build** | Vite 7 + TanStack Start |
| **Package Manager** | Bun / npm |

---

## 🔒 Security Highlights

- JWT tokens stored in `localStorage`, auto-refreshed before expiry
- Role-based routing — wrong role cannot access other dashboards
- All authenticated endpoints require `Authorization: Bearer` header
- Token blacklisting on logout (handled by backend)

---

## 🗺️ Roadmap

- [x] Citizen complaint filing with duplicate detection
- [x] Officer complaint management + worker assignment
- [x] Worker task flow with field notes
- [x] JWT auth with automatic token refresh
- [ ] Real-time notifications via WebSocket
- [ ] Admin analytics with live charts from backend
- [ ] Google Maps integration for real map
- [ ] OTP verification for registration
- [ ] Push notifications (PWA)
- [ ] Multilingual support (Hindi, Gujarati, Tamil, Telugu)

---

## 🔗 Related

| Repo | Description |
|------|-------------|
| [civicpulse-backend](https://github.com/jeevithswarup/civicpulse-backend) | Django REST Framework API |

---

<div align="center">

<br/>

**If this project helped you, give it a ⭐**

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:06b6d4,50:8b5cf6,100:6366f1&height=120&section=footer" width="100%"/>

**Built with ❤️ by [Jeevith Swarup](https://github.com/jeevithswarup)**

</div>
