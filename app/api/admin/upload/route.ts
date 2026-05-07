import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

const BUCKET = "soul-skin-images";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function normalizeFolder(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40) || "misc";
}

function extensionFor(type: string) {
  if (type === "image/jpeg") return "jpg";
  if (type === "image/png") return "png";
  return "webp";
}

export async function POST(request: NextRequest) {
  const expectedToken = process.env.ADMIN_TOKEN;
  const token = request.cookies.get("admin_token")?.value;

  if (!expectedToken || !token || token !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const folder = normalizeFolder((formData.get("folder") as string) || "misc");

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "JPG, PNG, WEBP only" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Max 5MB" }, { status: 400 });
  }

  const supabase = createServerClient();
  const fileName = `${folder}/${Date.now()}-${crypto.randomUUID()}.${extensionFor(file.type)}`;

  const { error } = await supabase.storage.from(BUCKET).upload(fileName, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    console.error("[upload]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

  return NextResponse.json({ url: publicUrl });
}
