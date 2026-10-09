import { useEffect } from 'react';
import axios from 'axios';

const PING_INTERVAL_MS = 4 * 60 * 1000; // Ping every 4 minutes (Render sleeps after 15 minutes of inactivity)

/**
 * BackendKeepAlive Component
 * Periodically pings the lightweight /health endpoint in the background
 * to reduce cold starts and prevent Render free-tier instances from idling.
 */
export default function BackendKeepAlive() {
  useEffect(() => {
    const fireHealthPing = async () => {
      try {
        const rawBaseURL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://prms-backend-jlrr.onrender.com' : '');
        const healthUrl = rawBaseURL ? `${rawBaseURL.replace(/\/+$/, '')}/health` : '/health';
        
        const reqHeaders = {};
        if (healthUrl.includes('ngrok')) {
          reqHeaders['ngrok-skip-browser-warning'] = 'true';
        }

        await axios.get(healthUrl, {
          timeout: 30000,
          headers: reqHeaders,
        });
      } catch {
        // Silent catch: cold-start warming or offline states should not interrupt the UI
      }
    };

    // 1. Fire immediately on page load / app mount
    fireHealthPing();

    // 2. Schedule recurring ping every 4 minutes
    const intervalId = setInterval(fireHealthPing, PING_INTERVAL_MS);

    // 3. Fire whenever user switches back to the tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fireHealthPing();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null;
}
