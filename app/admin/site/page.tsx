import { getSiteSettings } from "@/lib/db";
import SiteClient from "./SiteClient";

export const dynamic = "force-dynamic";

export default async function SitePage() {
  const settings = await getSiteSettings();

  return <SiteClient initialSettings={settings} />;
}
