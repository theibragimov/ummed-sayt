import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // /admin/login ga kirish har doim ruxsat
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // /admin/* himoyalangan
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_token')?.value
    const secret = process.env.ADMIN_SECRET || 'ummed-default-secret-2024'
    const expected = Buffer.from(`ummed-admin:${secret}`).toString('base64url')

    if (!token || token !== expected) {
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
