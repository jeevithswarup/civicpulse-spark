import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/civic/ComingSoon";
import { citizenNav } from "@/data/nav";
export const Route = createFileRoute("/citizen/report")({ component: () => <ComingSoon role="citizen" navItems={citizenNav} title="Report an Issue" contextLabel="Citizen" emergencyCta screen="Submit Complaint" /> });
