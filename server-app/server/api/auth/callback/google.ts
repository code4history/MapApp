// server/api/auth/callback/google.ts
import { $fetch } from 'ohmyfetch';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const code = getQuery(event).code;

   const tokenResponse = await $fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    body: {
      code,
      client_id: config.googleClientId,
      client_secret: config.googleClientSecret,
      redirect_uri: config.public.googleRedirectUri,
      grant_type: 'authorization_code',
    },
  });

 const userData = await $fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${tokenResponse.access_token}`,
    },
  });

  return { user: userData };
});