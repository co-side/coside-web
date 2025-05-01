import { NextRequest, NextResponse } from "next/server";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function handler(request: NextRequest) {


  const url = new URL(
    request.nextUrl.pathname.replace(/^\/api/, ""),
    BACKEND_URL
  );
  url.search = request.nextUrl.search;
  const token = request.cookies.get("token")?.value;

  const res = await fetch(url.toString(), {
    method: request.method,
    headers: {
      ...Object.fromEntries(request.headers.entries()),
      // Authorization: token ? `Bearer ${token}` : "", 
    },
    body: request.method !== "GET" ? request.body : null,
    ...(request.method !== "GET" && request.body ? { duplex: 'half' } : {}),
  });
  const body = await res.arrayBuffer();
  // status 若為 401 則 redirect 到登入頁面
  if (res.status === 401) {
    const redirectUrl = new URL("/?login=true", request.url);
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }
  const response = new Response(body, {
    status: res.status,
    statusText: res.statusText,
  });

  return response;
}
export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
export const OPTIONS = handler;
