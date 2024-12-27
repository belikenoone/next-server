import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET); // Use a secure secret key

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value; // Extract the 'token' cookie
  const isAuthRoute = request.nextUrl.pathname.startsWith("/auth");
  const isRootRoute = request.nextUrl.pathname === "/";

  // Handle requests to auth and root routes
  if (isAuthRoute || isRootRoute) {
    try {
      // Verify the JWT token
      const { payload } = await jwtVerify(token || "", SECRET);

      if (isAuthRoute) {
        // Authenticated users should not access /auth* routes
        return NextResponse.redirect(new URL("/", request.url));
      }

      if (isRootRoute) {
        // Authenticated users can proceed to the root route
        return NextResponse.next();
      }
    } catch (err) {
      // If the token is invalid or missing
      if (isRootRoute) {
        // Redirect non-authenticated users trying to access /
        return NextResponse.redirect(new URL("/auth/sign-up", request.url));
      }
      if (isAuthRoute) {
        // Non-authenticated users can access /auth* routes
        return NextResponse.next();
      }
    }
  }

  // For other routes, allow by default
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth"], // Apply middleware to / and /auth* routes
};
