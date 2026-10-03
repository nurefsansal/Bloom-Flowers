import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <span className="footer-logo">Bloom Flowers</span>

        <nav className="footer-nav">
          <Link to="/">Ana Sayfa</Link>
          <Link to="/products">Ürünler</Link>
          <a href="#about">Hakkımızda</a>
          <a href="#contact">İletişim</a>
        </nav>

        <div className="footer-contact">
          <a href="mailto:info@bloomflowers.com">info@bloomflowers.com</a>
          <a href="tel:+905000000000">+90 5xx xxx xx xx</a>
          <span>Çankaya, Ankara</span>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} Bloom Flowers. Tüm hakları saklıdır.</span>
      </div>
    </footer>
  );
}

export default Footer;