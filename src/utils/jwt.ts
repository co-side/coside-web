export function jwtDecode(token: string) {
  const payload = token.split('.')[1]
  const decodedPayload = Buffer.from(payload, 'base64').toString('utf-8')
  return JSON.parse(decodedPayload)
}

export function expToMaxAge(token: string) {
  try {
    const payload = jwtDecode(token) as { exp: number }
    const now = Math.floor(Date.now())
    return payload.exp * 1000 - now
  } catch (error) {
    return 0
  }
}

export function isJwtTokenExpired(token: string, early = 0) {
  try {
    const payload = jwtDecode(token) as { exp: number }
    return payload.exp * 1000 + early < Date.now()
  } catch (error) {
    return false
  }
}
