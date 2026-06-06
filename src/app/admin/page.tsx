import type { Metadata } from "next";
import { AdminPanel } from "./AdminPanel";

export const metadata: Metadata = {
  title: "Admin Panel — AD.CLICKSS",
  description: "Manage your portfolio photos",
};

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return <AdminPanel />;
}
