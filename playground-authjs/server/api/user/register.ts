import { PrismaClient } from '@prisma/client';
import { readBody } from 'h3'; // useBodyではなくreadBodyを使用
import { getToken } from '#auth' // getToken をインポート

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  assertMethod(event, 'POST');

  const body = await readBody(event);
  const { accountName } = body;

  const token = await getToken({ event });

  if (!token) {
    console.error('トークンが取得できませんでした');
    console.error('ヘッダー:', event.node.req.headers);
    throw new Error('認証エラー');
  }

  // アカウント名が入力されたタイミングでユーザー情報をデータベースに保存
  const user = await prisma.user.create({
    data: {
      name: token.name,
      service: token.service,
      email: token.email,
      sub: token.sub,
      iat: token.iat,
      exp: token.exp,
      jti: token.jti,
      accountName,  // ユーザーが入力したアカウント名を保存
    },
  });

  // `callbackUrl` があればその URL にリダイレクトし、なければ `/` にリダイレクト
  const callbackUrl = event.node.req.url?.split('callbackUrl=')[1] || '/';
  return sendRedirect(event, decodeURIComponent(callbackUrl));
});