import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/authContext';

function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  if (!user) return <div>Загрузка...</div>;
  return (
    <div className="profile-page">
      <h2>Профиль</h2>
      <p>
        <strong>Имя:</strong> {user.name || '—'}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <button onClick={handleLogout}>Выйти</button>
    </div>
  );
}
export default ProfilePage;
