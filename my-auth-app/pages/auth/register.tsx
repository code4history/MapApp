// pages/auth/register.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      router.push('/auth/verify-request');
    } else {
      setError(data.error);
    }
  };

  return (
    <div>
      <h1>ユーザー登録</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          ユーザー名:
          <input value={username} onChange={(e) => setUsername(e.target.value)} required/>
        </label>
        <br/>
        <label>
          メールアドレス:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
        </label>
        <br/>
        <label>
          パスワード:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
        </label>
        <br/>
        <button type="submit">登録</button>
      </form>
    </div>
  );
}