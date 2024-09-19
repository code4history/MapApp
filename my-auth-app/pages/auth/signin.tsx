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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">ログイン</h1>
        <form onSubmit={handleCredentialLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">ユーザー名:</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">パスワード:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            ログイン
          </button>
        </form>
        {error && <p className="text-red-600 mt-4">{error}</p>}
        <hr className="my-8" />
        <div className="space-y-4">
          <p className="text-center">または以下でログイン:</p>
          {Object.values(providers).map((provider) => {
            console.log(provider);
            if (provider.name !== 'Credentials') {
              return (
                <button
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className={`w-full py-2 rounded-md text-white flex justify-center items-center 
                  ${provider.name === 'Google' ? 'bg-red-500 hover:bg-red-600' : ''}
                  ${provider.name === 'GitHub' ? 'bg-gray-800 hover:bg-gray-900' : ''}
                  ${provider.name === 'Twitter (Legacy)' ? 'bg-blue-500 hover:bg-blue-600' : ''}`}
                >
                  <img
                    src={`/icons/${provider.name.toLowerCase()}.svg`}
                    alt={`${provider.name} icon`}
                    width={24}
                    height={24}
                    className="mr-2"
                  />
                  {provider.name}でログイン
                </button>
              );
            }
          })}
        </div>
        <p className="mt-4 text-center">
          アカウントをお持ちでない場合は{' '}
          <a href="/auth/register" className="text-indigo-600 hover:underline">
            登録
          </a>
        </p>
      </div>
    </div>
  );
}

SignIn.getInitialProps = async () => {
  const providers = await getProviders();
  return { providers };
};