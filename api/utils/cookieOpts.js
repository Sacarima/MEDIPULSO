// api/utils/cookieOpts.js
const isProd = process.env.NODE_ENV === 'production';
const cookieSecure = String(process.env.COOKIE_SECURE || '').toLowerCase() === 'true';
const cookieSameSite = (process.env.COOKIE_SAMESITE || 'lax'); // 'lax' or 'none'

export function cookieOpts(maxAgeMs) {
  return {
    httpOnly: true,
    secure: cookieSecure && isProd, // 'none' requires secure:true in browsers
    sameSite: cookieSameSite,       // 'lax' (same-site) or 'none' (cross-site)
    path: '/',
    maxAge: maxAgeMs,               // in ms
  };
}
