import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Define routes that are public (accessible to everyone)
const isPublicRoute = createRouteMatcher([
  '/', // The home page
  '/sign-in(.*)', // The sign-in page and all its sub-routes
  '/sign-up(.*)', // The sign-up page and all its sub-routes
  // Add any other public API routes or pages here if needed
]);

// 2. Define routes that are protected (require login)
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/history(.*)',
]);

export default clerkMiddleware((auth, req) => {
  // 3. If the route is NOT public, then protect it.
  // This is the "default-protect" model.
  if (!isPublicRoute(req)) {
    auth.protect();
  }
});

export const config = {
  // Run the middleware on all routes *except* for static assets.
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)", 
    "/", 
    "/(api|trpc)(.*)"
  ],
};