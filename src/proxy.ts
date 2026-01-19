import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const isAuthenticated = !!req.auth;
    const isLoginPage = req.nextUrl.pathname.startsWith("/login");

    if (isLoginPage) {
        if (isAuthenticated) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
        return NextResponse.next();
    }

    if (!isAuthenticated) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Secondary check for role
    const userRole = req.auth?.user?.role;
    if (userRole !== "webmaster") {
        return NextResponse.redirect(new URL("/login?error=AccessDenied", req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
