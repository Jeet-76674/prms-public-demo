package com.prms.security.ratelimit;

public interface RateLimiterService {

    /**
     * Attempts to consume 1 token for the specified key within the bucket capacity.
     *
     * @param key Unique identifier (e.g., "login:192.168.1.1" or "user:student@indus.edu")
     * @param capacity Maximum token capacity for the window
     * @param windowSeconds Window duration in seconds
     * @return true if token was consumed (allowed); false if limit was exceeded
     */
    boolean tryAcquire(String key, int capacity, long windowSeconds);

    /**
     * Calculates the estimated seconds remaining until at least 1 token is available.
     *
     * @param key Unique identifier
     * @param windowSeconds Window duration in seconds
     * @return Retry-after time in seconds
     */
    long getRetryAfterSeconds(String key, long windowSeconds);

}
