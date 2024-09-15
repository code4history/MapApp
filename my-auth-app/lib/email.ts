// lib/email.ts
import nodemailer from 'nodemailer';
import prisma from './prisma';
import { v4 as uuidv4 } from 'uuid';

export async function sendVerificationEmail(user) {
  const token = uuidv4();

  await prisma.verificationToken.create({
    data: {
      identifier: user.email,
      token,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  const transporter = nodemailer.createTransport(process.env.EMAIL_SERVER);

  const verifyUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}&email=${user.email}`;

  await transporter.sendMail({
    to: user.email,
    from: process.env.EMAIL_FROM,
    subject: 'メールアドレスの確認',
    html: `<p>以下のリンクをクリックしてメールアドレスを確認してください：<a href="${verifyUrl}">メール確認</a></p>`,
  });
}