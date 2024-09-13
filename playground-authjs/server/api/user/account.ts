import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await useBody(event);
  const { accountName } = body;

  const token = await getToken({ event });

  if (!token) {
    throw new Error('認証エラー');
  }

  await prisma.user.update({
    where: {
      sub: token.sub,
    },
    data: {
      accountName,
    },
  });

  return { success: true };
});