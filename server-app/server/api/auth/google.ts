import GoogleProvider from "next-auth/providers/google";
 
import { NuxtAuthHandler } from "#auth";
 
export default NuxtAuthHandler({
  providers: [
    // @ts-expect-error
    GoogleProvider.default({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
});