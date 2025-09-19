import { type NextRequest, NextResponse } from "next/server"
import { RateLimiter, AuditLogger, CSP_HEADER } from "./lib/security"

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Get client IP
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"
  const userAgent = request.headers.get("user-agent") || "unknown"

  // Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const identifier = `${ip}-${request.nextUrl.pathname}`

    if (RateLimiter.isRateLimited(identifier, 50, 60000)) {
      AuditLogger.log({
        action: "rate_limit_exceeded",
        ip,
        userAgent,
        timestamp: new Date(),
        details: { path: request.nextUrl.pathname },
        riskLevel: "medium",
      })

      return new NextResponse("Rate limit exceeded", { status: 429 })
    }

    // Add rate limit headers
    const remaining = RateLimiter.getRemainingRequests(identifier, 50)
    response.headers.set("X-RateLimit-Limit", "50")
    response.headers.set("X-RateLimit-Remaining", remaining.toString())
  }

  // Security headers
  response.headers.set("Content-Security-Policy", CSP_HEADER)
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")

  // Remove server information
  response.headers.delete("Server")
  response.headers.delete("X-Powered-By")

  // Audit logging for sensitive operations
  if (request.method !== "GET" || request.nextUrl.pathname.startsWith("/api/")) {
    AuditLogger.log({
      action: `${request.method}_${request.nextUrl.pathname}`,
      ip,
      userAgent,
      timestamp: new Date(),
      riskLevel: "low",
    })
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
