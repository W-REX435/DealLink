import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const role = session?.user?.role || 'creator';

  if (!session?.user) {
    const url = new URL('/creator/login', req.nextUrl.origin);
    url.searchParams.set('callbackUrl', pathname);
    return Response.redirect(url);
  }

  if (pathname.startsWith('/business/dashboard') && role !== 'business') {
    return Response.redirect(new URL('/creator/dashboard', req.nextUrl.origin));
  }

  if (pathname.startsWith('/creator/dashboard') && role === 'business') {
    return Response.redirect(new URL('/business/dashboard', req.nextUrl.origin));
  }

  return;
});

export const config = {
  matcher: ['/creator/dashboard/:path*', '/business/dashboard/:path*'],
};
