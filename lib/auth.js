// Admin auth — env da ADMIN_PASSWORD va ADMIN_SECRET bo'lishi kerak

export function sessionTokenYarat() {
  const secret = process.env.ADMIN_SECRET || 'ummed-default-secret-2024'
  const payload = `ummed-admin:${secret}`
  // Base64 encode (Edge runtime da crypto.subtle ishlatish mumkin, lekin bu yetarli)
  return Buffer.from(payload).toString('base64url')
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
