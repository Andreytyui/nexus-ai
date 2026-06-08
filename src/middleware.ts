import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const res = NextResponse.next();
  // Prevent search engines from indexing /admin and block caching
  res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  return res;
}

export const config = {
  matcher: ['/admin/:path*'],
};
