// pages/index.tsx
import { signOut, useSession } from 'next-auth/react';

export default function HomePage() {
  const { data: session } = useSession();

  console.log(session);

  if (session) {
    return (
      <div>
        <p>ログイン中: {session.user.email}</p>
        <p>ユーザーID: {session.user.id}</p>
        <button onClick={() => signOut()}>サインアウト</button>
      </div>
    );
  }
  return (
    <div>
      <p>ログインしていません</p>
      <a href="/auth/signin?callbackUrl=/">ログイン</a>
    </div>
  );
}