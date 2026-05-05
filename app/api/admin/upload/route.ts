import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

const BUCKET = "soul-skin-images";

export async function POST(request: NextRequest) {
  // Admin 認証チェック
  const token = request.cookies.get("admin_token")?.value;
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) || "misc";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // ファイルタイプ確認
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Images only" }, { status: 400 });
  }

  // ファイルサイズ制限: 5MB
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Max 5MB" }, { status: 400 });
  }

  const supabase = createServerClient();

  // ファイル名：タイムスタンプ + 元のファイル名でユニークに
  const ext = file.name.split(".").pop();
  const fileName = `${folder}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("[upload]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 公開 URL を返す
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(fileName);

  return NextResponse.json({ url: publicUrl });
}
