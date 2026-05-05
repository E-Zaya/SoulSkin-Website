import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin/login は保護しない（ログインページ）
  if (pathname === "/admin" || pathname === "/admin/login") {
    return NextResponse.next();
  }

  // /admin/* はトークン確認
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("admin_token")?.value;
    const expected = process.env.ADMIN_TOKEN;

    if (!token || !expected || token !== expected) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
