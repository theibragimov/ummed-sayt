import { NextResponse } from 'next/server'
import { sessionTokenTekshir } from '@/lib/auth'

export function proxy(request) {
  const { pathname } = request.nextUrl

  // /admin/login ga kirish har doim ruxsat
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // /admin/* himoyalangan
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_token')?.value

    if (!sessionTokenTekshir(token)) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
