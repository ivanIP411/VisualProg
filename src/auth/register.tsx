import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './authContext';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [pass2, setPass2] = useState('');
  const [err, setErr] = useState('');
  const nav = useNavigate();
  const { register } = useAuth();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    if (pass !== pass2) { setErr('Пароли не совпадают'); return; }
    if (pass.length < 8) { setErr('Пароль минимум 8 символов'); return; }
    try {
      await register(name, email, pass);
      nav('/dashboard');
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
      <h2>Регистрация</h2>
      {err && <div className="err">{err}</div>}
      <form onSubmit={submit}>
        <input type="text" placeholder="Имя" value={name} onChange={e => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Пароль (>= 8)" value={pass} onChange={e => setPass(e.target.value)} required />
        <input type="password" placeholder="Повторите пароль" value={pass2} onChange={e => setPass2(e.target.value)} required />
        <button type="submit">Зарегистрироваться</button>
      </form>
      <p>Уже есть аккаунт? <Link to="/login">Войти</Link></p>
    </div>
  );
}

export default Register;