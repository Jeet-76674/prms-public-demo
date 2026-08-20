import api from '../services/api';

/**
 * Resolves PDF URLs for resumes and job descriptions.
 * Falls back to static public demo PDFs if hosted on Vercel or running locally.
 */
export const resolvePdfUrl = (url, fallbackType = 'resume') => {
  const defaultSample = fallbackType === 'jd' ? '/samples/sample-jd.pdf' : '/samples/sample-resume.pdf';

  if (!url || typeof url !== 'string' || url.trim() === '') {
    return defaultSample;
  }

  // Already absolute web URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Sample files mapped to public directory
  if (url.includes('sample-jd.pdf') || url.includes('sample-jd') || url.toLowerCase().includes('samplejd')) {
    return '/samples/sample-jd.pdf';
  }
  if (url.includes('sample-resume.pdf') || url.includes('sample-resume') || url.toLowerCase().includes('sampleresume')) {
    return '/samples/sample-resume.pdf';
  }

  // If pointing to backend upload path
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  const base = api.defaults?.baseURL || '';
  if (base) {
    return `${base}${cleanUrl}`;
  }

  return cleanUrl;
};
