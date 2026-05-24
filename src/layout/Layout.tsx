import { Outlet, Link } from 'react-router-dom';

function Layout() {
  return (
    <div className="app-layout">
      <div className="sidebar">
        <h2>Меню</h2>
        <nav>
          <Link to="/dashboard">Мои документы</Link>
          <Link to="/profile">Профиль</Link>
        </nav>
      </div>
      <div className="main">
        <Outlet />
      </div>
    </div>
  );
}
export default Layout;