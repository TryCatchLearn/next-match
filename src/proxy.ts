import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const publicRoutes = [
    '/'
];

const authRoutes = [
    '/login',
    '/register'
]


export async function proxy(request: NextRequest) {
    const {nextUrl} = request;
	const sessionCookie = getSessionCookie(request);

    const isPublic = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    if (isPublic) return NextResponse.next();

    if (isAuthRoute) {
        if (sessionCookie) {
            return NextResponse.redirect(new URL('/members', nextUrl));
        }
        return NextResponse.next();
    }

	if (!sessionCookie && !isPublic) {
		return NextResponse.redirect(new URL("/login", nextUrl));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
};