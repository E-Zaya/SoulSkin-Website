const SUPABASE_STORAGE_PATTERN = /^https:\/\/[^/]+\.supabase\.co\/storage\/v1\/object\/public\//;

export function isManagedImageUrl(value: string): boolean {
  if (!value) return true;
  return value.startsWith("/") || SUPABASE_STORAGE_PATTERN.test(value);
}
