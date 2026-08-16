package com.prms.security.ratelimit;

import java.util.concurrent.ConcurrentHashMap;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class RateLimiterServiceImpl implements RateLimiterService {

    private static class Bucket {
        double tokens;
        long lastRefillNanos;
        final int capacity;
        final double refillRatePerNano;

        Bucket(int capacity, long windowSeconds) {
            this.capacity = capacity;
            this.tokens = capacity;
            this.lastRefillNanos = System.nanoTime();
            this.refillRatePerNano = (double) capacity / (windowSeconds * 1_000_000_000L);
        }

        synchronized boolean tryConsume() {
            refill();
            if (tokens >= 1.0) {
                tokens -= 1.0;
                return true;
            }
            return false;
        }

        synchronized long getRetryAfterSeconds() {
            refill();
            if (tokens >= 1.0) {
                return 0;
            }
            double neededTokens = 1.0 - tokens;
            long nanosNeeded = (long) Math.ceil(neededTokens / refillRatePerNano);
            long secondsNeeded = (nanosNeeded / 1_000_000_000L) + 1;
            return Math.max(1, secondsNeeded);
        }

        private void refill() {
            long now = System.nanoTime();
            long elapsedNanos = now - lastRefillNanos;
            if (elapsedNanos > 0) {
                double newTokens = elapsedNanos * refillRatePerNano;
                tokens = Math.min(capacity, tokens + newTokens);
                lastRefillNanos = now;
            }
        }
    }

    private final ConcurrentHashMap<String, Bucket> buckets = new ConcurrentHashMap<>();

    @Override
    public boolean tryAcquire(String key, int capacity, long windowSeconds) {
        Bucket bucket = buckets.computeIfAbsent(key, k -> new Bucket(capacity, windowSeconds));
        return bucket.tryConsume();
    }

    @Override
    public long getRetryAfterSeconds(String key, long windowSeconds) {
        Bucket bucket = buckets.get(key);
        if (bucket != null) {
            return bucket.getRetryAfterSeconds();
        }
        return windowSeconds;
    }

    // Periodic cleanup of stale rate limit keys every 30 minutes
    @Scheduled(fixedRate = 1800000)
    public void cleanupStaleBuckets() {
        long cutoff = System.nanoTime() - 3_600_000_000_000L; // 1 hour
        buckets.entrySet().removeIf(entry -> entry.getValue().lastRefillNanos < cutoff);
    }
}
