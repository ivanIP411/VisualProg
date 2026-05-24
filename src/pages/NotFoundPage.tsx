import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div>
      <h1>404</h1>
      <p>Страница не найдена</p>
      <Link to="/dashboard">Вернуться к документам</Link>
    </div>
  );
}
export default NotFoundPage;
