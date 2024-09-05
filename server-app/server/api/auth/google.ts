// server/api/auth/google.ts
import { sendRedirect } from 'h3';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const redirectUri = `https://accounts.google.com/o/oauth2/auth?client_id=${config.googleClientId}&redirect_uri=${encodeURIComponent(config.public.googleRedirectUri)}&response_type=code&scope=profile email`;
  
  return sendRedirect(event, redirectUri);
});