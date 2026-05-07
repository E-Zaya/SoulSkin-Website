export const DEFAULT_IMAGES = {
  about: "/about.png",
  drop: "/lookbook-01.png",
  product: "/product-jacket.png",
  lookbook: ["/lookbook-01.png", "/lookbook-02.png", "/lookbook-03.png"],
} as const;

const SUPABASE_STORAGE_PATTERN = /^https:\/\/[^/]+\.supabase\.co\/storage\/v1\/object\/public\//;

export function isManagedImageUrl(value: string): boolean {
  if (!value) return true;
  return value.startsWith("/") || SUPABASE_STORAGE_PATTERN.test(value);
}
