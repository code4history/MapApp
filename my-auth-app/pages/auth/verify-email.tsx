// pages/auth/verify-email.tsx
import { GetServerSideProps } from 'next';
import prisma from '../../lib/prisma';

export default function VerifyEmailPage({ success }) {
  if (success) {
    return <p>メールアドレスが確認されました。<a href="/auth/signin">ログイン</a>してください。</p>;
  } else {
    return <p>無効または期限切れのトークンです。</p>;
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { token, email } = context.query;

  const record = await prisma.verificationToken.findUnique({
    where: {
      identifier_token: {
        identifier: email as string,
        token: token as string,
      },
    },
  });

  if (record && record.expires > new Date()) {
    await prisma.user.update({
      where: { email: email as string },
      data: { emailVerified: new Date() },
    });
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email as string,
          token: token as string,
        },
      },
    });
    return { props: { success: true } };
  }

  return { props: { success: false } };
};