// Admin auth — env da ADMIN_PASSWORD va ADMIN_SECRET bo'lishi shart

function base64UrlEncode(value) {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(value).toString('base64url')
  }
  const bytes = new TextEncoder().encode(value)
  let binary = ''
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

export function sessionTokenYarat() {
  const secret = process.env.ADMIN_SECRET
  if (!secret) throw new Error('ADMIN_SECRET env variable is not set')
  return base64UrlEncode(`ummed-admin:${secret}`)
}

export function sessionTokenTekshir(token) {
  if (!token) return false
  try {
    const expected = sessionTokenYarat()
    if (token.length !== expected.length) return false
    // Timing-safe comparison (Node.js)
    if (typeof Buffer !== 'undefined') {
      const { timingSafeEqual } = require('crypto')
      return timingSafeEqual(Buffer.from(token), Buffer.from(expected))
    }
    return token === expected
  } catch {
    return false
  }
}

export function parolTekshir(kiritilganParol) {
  const togriParol = process.env.ADMIN_PASSWORD
  if (!togriParol) return false
  // Constant-time string comparison
  if (kiritilganParol.length !== togriParol.length) return false
  if (typeof Buffer !== 'undefined') {
    const { timingSafeEqual } = require('crypto')
    return timingSafeEqual(Buffer.from(kiritilganParol), Buffer.from(togriParol))
  }
  return kiritilganParol === togriParol
}

export function loginTekshir(kiritilganLogin) {
  const togriLogin = process.env.ADMIN_LOGIN
  if (!togriLogin) return true // ADMIN_LOGIN o'rnatilmagan bo'lsa, tekshirilmaydi
  const a = kiritilganLogin.toLowerCase()
  const b = togriLogin.toLowerCase()
  if (a.length !== b.length) return false
  if (typeof Buffer !== 'undefined') {
    const { timingSafeEqual } = require('crypto')
    return timingSafeEqual(Buffer.from(a), Buffer.from(b))
  }
  return a === b
}
