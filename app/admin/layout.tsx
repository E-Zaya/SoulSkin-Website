import type { Metadata } from "next";
import AdminNav from "./components/AdminNav";

export const metadata: Metadata = {
  title: "Admin — Soul Skin",
  robots: { index: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-void font-sans text-bone">
      <AdminNav />
      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-10">{children}</main>
    </div>
  );
}
