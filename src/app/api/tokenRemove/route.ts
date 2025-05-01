import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
    const res = NextResponse.json({ success: true });
    console.log("tokenRemove");
    res.cookies.set("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    })
    return res;

}