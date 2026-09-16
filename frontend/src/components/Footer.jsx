import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>Bloom Flowers</h3>
          <p>Her an için bir çiçek.</p>
        </div>

        <div className="footer-links">
          <h4>Hızlı Linkler</h4>
          <Link to="/">Ana Sayfa</Link>
          <Link to="/products">Ürünler</Link>
          <a href="#about">Hakkımızda</a>
          <a href="#contact">İletişim</a>
        </div>

        <div className="footer-contact">
          <h4>İletişim</h4>
          <p>info@bloomflowers.com</p>
          <p>+90 5xx xxx xx xx</p>
          <p>Çankaya, Ankara</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Bloom Flowers. Tüm hakları saklıdır.</p>
      </div>
    </footer>
  );
}

export default Footer;