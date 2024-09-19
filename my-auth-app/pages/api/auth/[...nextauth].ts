// pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import CustomPrismaAdapter from '@/lib/custom_prisma_adaptor';
import prisma from '../../../lib/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import TwitterProvider from 'next-auth/providers/twitter';
import bcrypt from 'bcrypt';

export default NextAuth({
  adapter: CustomPrismaAdapter,
  providers: [
    // クレデンシャルログイン
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'ユーザー名', type: 'text' },
        password: { label: 'パスワード', type: 'password' },
      },
      async authorize(credentials) {
        // credentials が undefined でないことを確認
        if (!credentials || !credentials.username || !credentials.password) {
          return null; // credentials が不足している場合は null を返す
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });

        if (user && user.password) {
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (isValid) {
            return user;
          }
        }
        return null;
      },
    }),

    // Google プロバイダー
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // GitHub プロバイダー
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),

    // Twitter プロバイダー
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // ソーシャルログイン時に同じメールアドレスのユーザーをリンク
      if (account && account.provider !== 'credentials') {
        const existingUser = await prisma.user.findUnique({
          where: { 
            email: user.email ?? undefined, // email が null の場合は undefined に変換
          },
        });

        if (existingUser) {
          // 新しいアカウントを既存のユーザーにリンク
          await prisma.account.upsert({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
            update: {
              userId: existingUser.id,
            },
            create: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: account.session_state,
            },
          });
          return true;
        }
      }
      return true;
    },
    async session({ session, token, user }) {
      // クレデンシャルログインのユーザー情報もセッションに追加
      console.log("Session");
      console.log(`Session: ${JSON.stringify(session)}`);
      console.log(`Token: ${JSON.stringify(token)}`);      
      console.log(`User: ${JSON.stringify(user)}`);
      if (user) {
        session.user = user;
        //session.user.id = user.id;
        //session.user.email = user.email;
      }
      return session;
    },
    async jwt({ token, user }) {
      console.log("JWT");
      console.log(`Token: ${JSON.stringify(token)}`);      
      console.log(`User: ${JSON.stringify(user)}`);
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.defaultName = user.name;
        token.defaultPicture = user.image;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // callbackUrlのパラメータを取得する
      const targetUrl = url.startsWith('/') ? `${baseUrl}${url}` : url;
      const callbackUrl = new URL(targetUrl).searchParams.get('callbackUrl') || "/";
      const callbackTarget = callbackUrl.startsWith('/') ? `${baseUrl}${callbackUrl}` : callbackUrl;
      
      // callbackUrlがあればそこにリダイレクトし、なければbaseUrlにリダイレクト
      return callbackTarget || baseUrl;
    }
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
    newUser: null,
  },
});