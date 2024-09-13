import { PrismaClient } from '@prisma/client'
import CredentialsProvider from 'next-auth/providers/credentials'
import GithubProvider from 'next-auth/providers/github'
import TwitterProvider from 'next-auth/providers/twitter'
import GoogleProvider from 'next-auth/providers/google'
import { NuxtAuthHandler } from '#auth'
import { PrismaAdapter } from "@auth/prisma-adapter"

const prisma = new PrismaClient()

export default NuxtAuthHandler({
  // a) Never hardcode your secret in your code!! and b) use a secure secret, `test-123` is **not** secure!!
  secret: process.env.AUTH_SECRET ?? 'test-123',
  useSecureCookies: false, //process.env.NODE_ENV === 'production', // 本番環境でのみ secureCookie を有効
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    GithubProvider.default({
      clientId: process.env.GITHUB_CLIENT_ID ?? 'your-client-id',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? 'your-client-secret'
    }),
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    GoogleProvider.default({
      clientId: process.env.GOOGLE_CLIENT_ID ?? 'your-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? 'your-client-secret'
    }),
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    TwitterProvider.default({
      clientId: process.env.TWITTER_CLIENT_ID ?? 'your-client-id',
      clientSecret: process.env.TWITTER_CLIENT_SECRET ?? 'your-client-secret'
    }),
    /*// @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    CredentialsProvider.default({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: '(hint: jsmith)' },
        password: { label: 'Password', type: 'password', placeholder: '(hint: hunter2)' }
      },
      authorize(credentials: any) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // NOTE: THE BELOW LOGIC IS NOT SAFE OR PROPER FOR AUTHENTICATION!

        const user = { id: '1', name: 'J Smith', username: 'jsmith', password: 'hunter2' }

        if (credentials?.username === user.username && credentials?.password === user.password) {
          // Any object returned will be saved in `user` property of the JWT
          return user
        }
        else {
          console.error('Warning: Malicious login attempt registered, bad credentials provided')

          // If you return null then an error will be displayed advising the user to check their details.
          return null

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    })*/
  ],
  adapter: PrismaAdapter(prisma) as ( Adapter | undefined ),
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log(`signIn ${user} ${account} ${profile} ${email} ${credentials}`);

      /*/ 既存のユーザーをメールアドレスで検索
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email }
      });

      if (existingUser) {
        // 既存のユーザーが見つかった場合、そのユーザーに新しいアカウントを追加
        const existingAccount = await prisma.account.findFirst({
          where: {
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            userId: existingUser.id,
          },
        });

        if (!existingAccount) {
          // 新しいアカウントをユーザーに紐づける
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              type: account.type,
            },
          });
        }
        // ログインを許可
        return true;
      }

      // 新しいユーザーを作成する場合
      return true; // デフォルトの動作に従う*/



















      // OAuthプロバイダー名
      /*const service = account.provider;

      // 既存ユーザーをチェック
      const existingUser = await prisma.user.findUnique({
        where: {
          sub: account.providerAccountId,  // OAuthのユーザーID(sub)
        },
      });

      if (!existingUser) {
        user.isNewUser = true;
      }*/

      return true; // ログインを許可
    },
    async redirect({ url, baseUrl }) {
      console.log(`redirect ${url} ${baseUrl}`);

      return url
      //return baseUrl
    },
    async session({ session, user, token }) {
      console.log(`session ${session} ${token}`);
      // セッションに必要なユーザー情報を含める
      /*session.user.sub = token.sub;
      session.user.service = token.service;
      session.user.isNewUser = token.isNewUser ?? false;
      if (token.callbackUrl) session.callbackUrl = token.callbackUrl;*/
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log(`jwt ${token} ${user} ${account} ${profile} ${isNewUser}`);
      /*if (account) {
        token.sub = account.providerAccountId;
        token.service = account.provider;
        token.iat = account.iat;
        token.exp = account.exp;
        token.jti = account.jti;

        // 新規ユーザーかどうかのフラグをJWTに追加
        if (user?.isNewUser) {
          token.isNewUser = true;
          if (account.callbackUrl) token.callbackUrl = account.callbackUrl;
        }
      }*/
      return token;
    }
  },
})
