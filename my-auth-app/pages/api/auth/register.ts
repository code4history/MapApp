// pages/api/auth/register.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcrypt';
import { sendVerificationEmail } from '../../../lib/email';

export default async function register(req: NextApiRequest, res: NextApiResponse) {
  const { username, email, password } = req.body;

  // ユーザー名の重複チェック
  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    return res.status(400).json({ error: 'ユーザー名は既に存在します' });
  }

  console.log(password);
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  // 確認メールの送信
  await sendVerificationEmail(user);

  res.status(200).json({ message: 'ユーザー登録が完了しました。メールを確認してください。' });
}