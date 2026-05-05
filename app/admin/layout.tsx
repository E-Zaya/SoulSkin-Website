import type { Metadata } from "next";
import AdminNav from "./components/AdminNav";

export const metadata: Metadata = {
  title: "Admin — Soul Skin",
  robots: { index: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen bg-[#0c0c0c] text-[#e8e8e8]"
      style={{ fontFamily: "'Helvetica Neue', Arial, monospace" }}
    >
      <AdminNav />
      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-10">{children}</main>
    </div>
  );
}
