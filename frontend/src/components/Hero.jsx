import { Link } from 'react-router-dom';
import './Hero.css';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-image-wrapper">
        <img
          src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1800"
          alt="Bloom Flowers buketi"
          className="hero-image"
        />

        <div className="hero-overlay"></div>

        <div className="hero-content">
          <span className="hero-eyebrow">BLOOM FLOWERS</span>

          <h1 className="hero-title">
            Her Dal Bir
            <br />
            Hikâye Anlatır.
          </h1>

          <p className="hero-subtitle">
            Özel anlarınız için özenle hazırlanan
            <br />
            taze ve butik çiçek tasarımları.
          </p>

          <Link to="/products" className="hero-cta">
            Ürünleri Keşfet
            <span>→</span>
          </Link>
        </div>

        <div className="hero-caption">
          <span>01</span>
          <span>FLOWER COLLECTION</span>
        </div>

        <div className="hero-scroll">
          <span>SCROLL</span>
          <span className="hero-scroll-line"></span>
        </div>
      </div>
    </section>
  );
}

export default Hero;