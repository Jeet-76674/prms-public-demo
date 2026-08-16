package com.prms.security.ratelimit;

import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.prms.config.RateLimitProperties;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 1)
public class RateLimitFilter extends OncePerRequestFilter {

    @Autowired
    private RateLimiterService rateLimiterService;

    @Autowired
    private RateLimitProperties rateLimitProperties;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        if (!rateLimitProperties.isEnabled()) {
            filterChain.doFilter(request, response);
            return;
        }

        // Allow CORS preflight requests
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String uri = request.getRequestURI();
        String method = request.getMethod();
        String clientIp = getClientIp(request);

        String rateLimitKey = null;
        int capacity = 0;
        long windowSeconds = 0;

        if (uri.startsWith("/api/auth/login") && "POST".equalsIgnoreCase(method)) {
            rateLimitKey = "rl:login:" + clientIp;
            capacity = rateLimitProperties.getLoginPerMinute();
            windowSeconds = 60;
        } else if (uri.startsWith("/api/auth/signup") && "POST".equalsIgnoreCase(method)) {
            rateLimitKey = "rl:signup:" + clientIp;
            capacity = rateLimitProperties.getSignupPer10Minutes();
            windowSeconds = 600;
        } else if ((uri.startsWith("/api/otp/") || uri.startsWith("/api/auth/forgot-password")) && "POST".equalsIgnoreCase(method)) {
            rateLimitKey = "rl:otp:" + clientIp;
            capacity = rateLimitProperties.getOtpPerHour();
            windowSeconds = 3600;
        } else if (uri.startsWith("/api/student/profile/resume") && "POST".equalsIgnoreCase(method)) {
            String userIdentifier = getUserIdentifier(clientIp);
            rateLimitKey = "rl:resume:" + userIdentifier;
            capacity = rateLimitProperties.getResumeUploadPerHour();
            windowSeconds = 3600;
        } else if (uri.matches("/api/recruiter/jobs/\\d+/jd") && "POST".equalsIgnoreCase(method)) {
            String userIdentifier = getUserIdentifier(clientIp);
            rateLimitKey = "rl:jd:" + userIdentifier;
            capacity = rateLimitProperties.getJdUploadPerHour();
            windowSeconds = 3600;
        } else if (uri.startsWith("/api/demo/reset") && "POST".equalsIgnoreCase(method)) {
            rateLimitKey = "rl:demo_reset:" + clientIp;
            capacity = rateLimitProperties.getDemoResetPerHour();
            windowSeconds = 3600;
        } else if (uri.startsWith("/api/")) {
            // General API rate limit
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
                rateLimitKey = "rl:gen_auth:" + auth.getName();
                capacity = rateLimitProperties.getAuthPerMinute();
                windowSeconds = 60;
            } else {
                rateLimitKey = "rl:gen_unauth:" + clientIp;
                capacity = rateLimitProperties.getUnauthPerMinute();
                windowSeconds = 60;
            }
        }

        if (rateLimitKey != null) {
            boolean allowed = rateLimiterService.tryAcquire(rateLimitKey, capacity, windowSeconds);
            if (!allowed) {
                long retryAfter = rateLimiterService.getRetryAfterSeconds(rateLimitKey, windowSeconds);
                sendRateLimitResponse(response, retryAfter);
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private String getUserIdentifier(String fallbackIp) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            return auth.getName();
        }
        return fallbackIp;
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader != null && !xfHeader.isEmpty() && !"unknown".equalsIgnoreCase(xfHeader)) {
            return xfHeader.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private void sendRateLimitResponse(HttpServletResponse response, long retryAfter) throws IOException {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setHeader("Retry-After", String.valueOf(retryAfter));
        response.getWriter().write(String.format(
                "{\"success\":false,\"message\":\"Too many requests. Rate limit exceeded. Please try again in %d seconds.\",\"retryAfterSeconds\":%d}",
                retryAfter, retryAfter
        ));
    }
}
