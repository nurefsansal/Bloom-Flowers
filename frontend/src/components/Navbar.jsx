import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="navbar">
      <Link to="/" className="navbar-logo">
        Bloom Flowers
      </Link>

      <nav className="navbar-links">
        <Link to="/">Ana Sayfa</Link>
        <Link to="/products">Ürünler</Link>
        <a href="#about">Hakkımızda</a>
        <a href="#contact">İletişim</a>
      </nav>

      <div className="navbar-actions">
        <Link
          to="/cart"
          className="navbar-icon-btn"
          aria-label="Sepet"
        >
          🛒
        </Link>

        {user ? (
          <div className="navbar-user">
            {user.role === 'Admin' && (
              <div className="navbar-admin-links">
                <Link to="/admin/dashboard">Dashboard</Link>
                <Link to="/admin/products">Ürünler</Link>
                <Link to="/admin/categories">Kategoriler</Link>
                <Link to="/admin/orders">Siparişler</Link>
              </div>
            )}

            <Link
              to="/orders"
              className="navbar-orders-link"
            >
              Siparişlerim
            </Link>

            <span className="navbar-user-name">
              Merhaba, {user.fullName}
            </span>

            <button
              onClick={handleLogout}
              className="navbar-logout-btn"
            >
              Çıkış Yap
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="navbar-icon-btn"
            aria-label="Hesap"
          >
            👤
          </Link>
        )}
      </div>
    </header>
  );
}

export default Navbar;