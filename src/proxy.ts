import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isAuth = !!token;
        const isLoginPage = req.nextUrl.pathname.startsWith("/login");

        if (isLoginPage) {
            if (isAuth) {
                return NextResponse.redirect(new URL("/", req.url));
            }
            return NextResponse.next();
        }

        if (!isAuth) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        // Secondary check for role
        if (token?.role !== "webmaster") {
            return NextResponse.redirect(new URL("/login?error=AccessDenied", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: () => true,
        },
    }
);

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
