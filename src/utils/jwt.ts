export function jwtDecode(token: string) {
  const payload = token.split('.')[1]
  const decodedPayload = Buffer.from(payload, 'base64').toString('utf-8')
  return JSON.parse(decodedPayload)
}