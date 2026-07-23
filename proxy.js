import { NextResponse } from 'next/server'

// Edge Runtime-da ishlaydigan token tekshiruvi
function base64UrlEncode(value) {
  const bytes = new TextEncoder().encode(value)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function getExpectedToken() {
  const secret = process.env.ADMIN_SECRET
  if (!secret) return null
  return base64UrlEncode(`ummed-admin:${secret}`)
}

export function proxy(request) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_token')?.value
    const expected = getExpectedToken()

    if (!token || !expected || token !== expected) {
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
