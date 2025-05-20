/**
 * @path /api/auth/logout
 */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete('access_token')
  cookieStore.delete('refresh_token')
  cookieStore.delete('login_redirect_url')
  cookieStore.delete('signup_token')
  cookieStore.delete('signup_name')
  cookieStore.delete('signup_email')
  return NextResponse.json({ message: 'Logout Success!' })
}
