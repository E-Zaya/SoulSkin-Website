import { getLookbookItems } from "@/lib/db";
import LookbookClient from "./LookbookClient";

export const dynamic = "force-dynamic";

export default async function LookbookPage() {
  const items = await getLookbookItems();
  return <LookbookClient initialItems={items} />;
}
