import { NextRequest, NextResponse } from "next/server";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function handleRequest(request: NextRequest) {
  const url = new URL(
    request.nextUrl.pathname.replace(/^\/api\//, ""),
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
    body: request.method !== "GET" ? request.body : null
  });

  if (res.status === 401) {
    const redirectUrl = new URL("/?login=true", request.url);
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  const body = await res.arrayBuffer();
  return new Response(body, {
    status: res.status,
    statusText: res.statusText,
  });
}

export async function GET(request: NextRequest) {
  return handleRequest(request);
}

export async function POST(request: NextRequest) {
  return handleRequest(request);
}

export async function PUT(request: NextRequest) {
  return handleRequest(request);
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request);
}

export async function PATCH(request: NextRequest) {
  return handleRequest(request);
}

export async function OPTIONS(request: NextRequest) {
  return handleRequest(request);
}
