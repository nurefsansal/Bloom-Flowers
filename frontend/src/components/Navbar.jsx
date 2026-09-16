import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="navbar-logo">Bloom Flowers</Link>

      <nav className="navbar-links">
        <Link to="/">Ana Sayfa</Link>
        <Link to="/products">Ürünler</Link>
        <a href="#about">Hakkımızda</a>
        <a href="#contact">İletişim</a>
      </nav>

      <div className="navbar-actions">
        <Link to="/cart" className="navbar-icon-btn" aria-label="Sepet">🛒</Link>
        <button className="navbar-icon-btn" aria-label="Hesap">👤</button>
      </div>
    </header>
  );
}

export default Navbar;