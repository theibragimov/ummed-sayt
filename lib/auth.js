// Admin auth — env da ADMIN_PASSWORD va ADMIN_SECRET bo'lishi kerak

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
  const secret = process.env.ADMIN_SECRET || 'ummed-default-secret-2024'
  const payload = `ummed-admin:${secret}`
  return base64UrlEncode(payload)
}

export function sessionTokenTekshir(token) {
  if (!token) return false
  try {
    const expected = sessionTokenYarat()
    return token === expected
  } catch {
    return false
  }
}

export function parolTekshir(kiritilganParol) {
  const togriParol = process.env.ADMIN_PASSWORD
  if (!togriParol) return false
  return kiritilganParol === togriParol
}
