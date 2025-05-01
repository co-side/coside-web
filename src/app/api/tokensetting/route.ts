import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// set the token to cookie for safe keeping
export async function POST(request: NextRequest) {
    const { token } = await request.json();
    
    if (!token) {
        return NextResponse.json({ message: "Token is required" }, { status: 400 });
    }
    const response = NextResponse.json({ message: "Token set successfully" });
    response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'lax',
        path: '/',            
    })
    return response;
}


export async function GET(request: NextRequest) {
    // remove the token from cookie
    

}