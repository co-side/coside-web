import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if(pathname === '/project/create'){
    try {
      const token = request.cookies.get('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        headers: { Authorization: token.value ? `Bearer ${token.value}` : "" },
      });

    }catch(e) {
      return NextResponse.redirect(new URL('/?login=true', request.url));
    }
    if(!request.cookies.get('token')){
      
      return NextResponse.redirect(new URL('/?login=true', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/project/create"],
}