import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Routes publiques (accessibles sans token)
  const publicRoutes = ['/auth/login', '/auth/register'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Routes dashboard
  const isDashboardRoute = pathname.startsWith('/dashboard');

  // CAS 1 : Pas de token ET route privée (dashboard) → redirect login
  if (!token && isDashboardRoute) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // CAS 2 : Page d'accueil (/)
  if (pathname === '/') {
    // Si token, rediriger vers dashboard (selon le rôle dans page.tsx)
    // Sinon, laisser passer (la page redirigera elle-même vers login)
    return NextResponse.next();
  }

  // CAS 3 : Routes publiques (login/register)
  // On laisse TOUJOURS passer, même avec un token
  // (l'utilisateur peut vouloir se reconnecter avec un autre compte)
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // CAS 4 : Toutes les autres routes
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};