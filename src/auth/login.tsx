import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from './authContext';

function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const nav = useNavigate();
  const loc = useLocation();
  const { login } = useAuth();
  const from = loc.state?.from?.pathname || '/dashboard';
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    try {
      await login(email, pass);
      nav(from, { replace: true });
    } catch (e: unknown) {
      if (e instanceof Error) {
        setErr(e.message);
      } else {
        setErr('Ошибка');
      }
    }
  };
  return (
    <div className="auth-page">
      <h2>Вход</h2>
      {err && <div className="err">{err}</div>}
      <form onSubmit={submit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          required
        />
        <button type="submit">Войти</button>
      </form>
      <p>
        Нет аккаунта? <Link to="/register">Регистрация</Link>
      </p>
    </div>
  );
}
export default Login;
