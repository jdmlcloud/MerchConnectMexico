import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const stage = process.env.NEXT_PUBLIC_STAGE;
  // Basic CORS/runtime stage guard: SSR-safe
  if (stage === 'dev' && url.hostname.includes('sbx')) return new NextResponse('Forbidden', { status: 403 });
  if (stage === 'sbx' && url.hostname.includes('dev')) return new NextResponse('Forbidden', { status: 403 });
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/workshop/:path*', '/proveedor/:path*'],
};
