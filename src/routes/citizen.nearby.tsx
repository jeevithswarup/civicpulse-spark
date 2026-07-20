import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/civic/AppShell";
import { citizenNav } from "@/data/nav";
import { MapPlaceholder } from "@/components/civic/MapPlaceholder";
import { StatusBadge } from "@/components/civic/StatusBadge";
import { PriorityBadge } from "@/components/civic/PriorityBadge";
import { CategoryBadge } from "@/components/civic/CategoryBadge";
import { getNearbyComplaints, getPopularComplaints, type Complaint } from "@/lib/api/complaints";
import { MapPin, Loader2, Navigation, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { timeAgo } from "@/lib/formatters";

export const Route = createFileRoute("/citizen/nearby")({ component: NearbyPage });

// Vadodara city centre as default
const DEFAULT_LAT = 22.3072;
const DEFAULT_LON = 73.1812;

function NearbyPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [userLat, setUserLat] = useState<number>(DEFAULT_LAT);
  const [userLon, setUserLon] = useState<number>(DEFAULT_LON);
  const [locationLabel, setLocationLabel] = useState("Vadodara (default)");
  const [locationGranted, setLocationGranted] = useState(false);

  async function fetchNearby(lat: number, lon: number) {
    setLoading(true);
    try {
      const data = await getNearbyComplaints(lat, lon);
      // If backend returns empty, fall back to popular complaints
      if (data.length === 0) {
        const popular = await getPopularComplaints();
        setComplaints(popular);
      } else {
        setComplaints(data);
      }
    } catch {
      // Silently fall back to popular complaints
      try {
        const popular = await getPopularComplaints();
        setComplaints(popular);
      } catch {
        toast.error("Could not load nearby complaints");
      }
    } finally {
      setLoading(false);
    }
  }

  // On mount — try to get real GPS, fall back to default coords
  useEffect(() => {
    if (!navigator.geolocation) {
      fetchNearby(DEFAULT_LAT, DEFAULT_LON);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setUserLat(lat);
        setUserLon(lon);
        setLocationLabel(`Your location (${lat.toFixed(4)}, ${lon.toFixed(4)})`);
        setLocationGranted(true);
        fetchNearby(lat, lon);
      },
      () => {
        // Permission denied or unavailable — use default
        setLocationLabel("Vadodara (location denied)");
        fetchNearby(DEFAULT_LAT, DEFAULT_LON);
      },
      { timeout: 8000, maximumAge: 60000 }
    );
  }, []);

  function refreshLocation() {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setUserLat(lat);
        setUserLon(lon);
        setLocationLabel(`Your location (${lat.toFixed(4)}, ${lon.toFixed(4)})`);
        setLocationGranted(true);
        setLocating(false);
        toast.success("Location updated!");
        fetchNearby(lat, lon);
      },
      () => {
        setLocating(false);
        toast.error("Could not get your location. Check browser permissions.");
      },
      { timeout: 8000 }
    );
  }

  // Build map-compatible shape
  const mapComplaints = complaints.map((c) => ({
    id: String(c.id),
    title: c.title,
    description: c.description,
    category: c.category,
    status: c.status,
    priority: c.priority,
    location: {
      lat: Number(c.latitude),
      lng: Number(c.longitude),
      address: c.address,
    },
  }));

  return (
    <AppShell
      role="citizen"
      navItems={citizenNav}
      title="Nearby Issues"
      subtitle={loading ? "Locating…" : `${complaints.length} complaints found`}
      contextLabel="Citizen"
      emergencyCta
    >
      {/* Location bar */}
      <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3">
        <div className="flex items-center gap-2 text-sm">
          <span className={`inline-flex size-2 rounded-full ${locationGranted ? "bg-green-500" : "bg-amber-400"}`} />
          <MapPin className="size-4 text-muted-foreground" />
          <span className="text-muted-foreground">{locationLabel}</span>
        </div>
        <button
          onClick={refreshLocation}
          disabled={locating}
          className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent disabled:opacity-50"
        >
          {locating
            ? <Loader2 className="size-3.5 animate-spin" />
            : <Navigation className="size-3.5" />}
          {locating ? "Locating…" : "Update location"}
        </button>
      </div>

      {/* Map */}
      <MapPlaceholder
        complaints={mapComplaints as never}
        height="h-[420px]"
        showLegend
        showUserDot={locationGranted}
      />

      {/* Complaints list */}
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {loading ? "Loading…" : `${complaints.length} issues nearby`}
          </h2>
          <button
            onClick={() => fetchNearby(userLat, userLon)}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline disabled:opacity-50"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {loading && (
          <div className="flex items-center gap-2 py-12 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Fetching nearby complaints…
          </div>
        )}

        {!loading && complaints.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No complaints found near your location.
            <Link to={"/citizen/report" as never} className="mt-2 block text-primary hover:underline">
              Be the first to report one →
            </Link>
          </div>
        )}

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {complaints.map((c) => (
            <Link
              key={c.id}
              to={"/citizen/complaints/$id" as never}
              params={{ id: String(c.id) } as never}
              className="group block rounded-2xl border bg-card p-4 shadow-card transition hover:shadow-card-hover"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  <CategoryBadge category={c.category} />
                  <PriorityBadge priority={c.priority} />
                </div>
                <StatusBadge status={c.status} dot />
              </div>

              {/* Title */}
              <h3 className="mt-2 line-clamp-2 text-sm font-semibold group-hover:text-primary">
                {c.title}
              </h3>

              {/* Address */}
              <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3 shrink-0" />
                <span className="truncate">{c.address}</span>
              </div>

              {/* Footer */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{timeAgo(c.created_at)}</span>
                <span>👍 {c.support_count}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
