import { createClient } from "@supabase/supabase-js";

/**
 * サーバーサイド専用クライアント（service_role キー使用）
 * Admin の書き込み操作に使用。クライアントサイドで使用禁止。
 */
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

/**
 * 公開クライアント（anon キー使用）
 * フロントエンドの読み取り用。RLS ポリシーに従う。
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
