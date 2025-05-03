import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { httpProxy } from "./libs/http/server";
import { API_SERVER_URL } from "./constant";

export async function middleware(request: NextRequest) {
  // console.log("middleware", request.nextUrl.toString());
  const { pathname } = request.nextUrl;
  if (/^\/api\/(.*)/.test(pathname)) {
    return await httpProxy(request, {
      rewrite: (req) => ({
        target: API_SERVER_URL,
        changeOrigin: true,
        path: req.nextUrl.pathname.replace(/^\/api/, '')
      }),
    })
  }
  if (pathname === '/project/create') {
    try {
      const token = request.cookies.get('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        headers: { Authorization: token.value ? `Bearer ${token.value}` : "" },
      });
    } catch (e) {
      return NextResponse.redirect(new URL('/?login=true', request.url));
    }
    if (!request.cookies.get('token')) {
      return NextResponse.redirect(new URL('/?login=true', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {}
