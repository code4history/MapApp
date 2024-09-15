// pages/auth/signin.tsx
import { getProviders, signIn } from 'next-auth/react';
import { useState } from 'react';

export default function SignIn({ providers }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleCredentialLogin = async (e) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    if (res?.error) {
      setError('ユーザー名またはパスワードが無効です');
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div>
      <h1>ログイン</h1>
      <form onSubmit={handleCredentialLogin}>
        <label>
          ユーザー名:
          <input value={username} onChange={(e) => setUsername(e.target.value)} required/>
        </label>
        <br/>
        <label>
          パスワード:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
        </label>
        <br/>
        <button type="submit">ログイン</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <hr/>
      <div>
        <p>または以下でログイン:</p>
        {Object.values(providers).map((provider) => {
          if (provider.name !== 'Credentials') {
            return (
              <div key={provider.name}>
                <button onClick={() => signIn(provider.id)}>
                  {provider.name}でログイン
                </button>
              </div>
            );
          }
        })}
      </div>
      <p>
        アカウントをお持ちでない場合は <a href="/auth/register">登録</a>
      </p>
    </div>
  );
}

SignIn.getInitialProps = async () => {
  const providers = await getProviders();
  return { providers };
};