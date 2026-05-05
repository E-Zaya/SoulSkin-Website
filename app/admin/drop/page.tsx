import { getAllDrops } from "@/lib/db";
import DropClient from "./DropClient";

export const dynamic = "force-dynamic";

export default async function DropPage() {
  const drops = await getAllDrops();
  return <DropClient initialDrops={drops} />;
}
