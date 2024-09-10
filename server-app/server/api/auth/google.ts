import GoogleProvider from "next-auth/providers/google"
//import CredentialsProvider from 'next-auth/providers/credentials'
import { NuxtAuthHandler } from "#auth";

export default NuxtAuthHandler({
  pages: {
	signIn: "/login", // 用意したログインページに設定
  },
  providers: [
    // Github
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
})