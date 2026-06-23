import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

const publicRoutes = [
    '/'
];

const authRoutes = [
    '/login',
    '/register',
    '/verify-email',
    '/forgot-password',
    '/reset-password'
]


export async function proxy(request: NextRequest) {
    const {nextUrl} = request;
	const session = await auth.api.getSession({
        headers: await headers()
    });

    const isPublic = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    const isCompleteProfileRoute = nextUrl.pathname === '/complete-profile'

    if (isPublic) return NextResponse.next();

    if (isAuthRoute) {
        if (session && !isCompleteProfileRoute) {
            return NextResponse.redirect(new URL('/members', nextUrl));
        }
        return NextResponse.next();
    }

	if (!session && !isPublic) {
		return NextResponse.redirect(new URL("/login", nextUrl));
	}

    if (session && !isCompleteProfileRoute && !isPublic && !session.user.profileComplete) {
        return NextResponse.redirect(new URL('/complete-profile', nextUrl))
    }

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
};