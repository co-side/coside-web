import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";
import { nextRequestToAxiosConfig } from "./libs/http/common";
import { createServerAxios } from "./libs/http/server";

export async function middleware(request: NextRequest) {
  // console.log("middleware", request.nextUrl.toString());
  const { pathname } = request.nextUrl;
  if (/^\/api\/(.*)/.test(pathname)) {
    const res = await createServerAxios().request(await nextRequestToAxiosConfig(request))
    .catch((error) => {
      console.log('error', error.config.url);
      return Promise.reject(new Error(error.message))
    })
    return NextResponse.json(res.data)
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
