import { Link } from 'react-router-dom';
import './Campaign.css';

function Campaign() {
  return (
    <section className="campaign">
      <div className="campaign-image-wrapper">
        <img
          src="https://images.unsplash.com/photo-1495231916356-a86217efff12?w=1600"
          alt="Özel günler için çiçek tasarımı"
          className="campaign-image"
        />
      </div>

      <div className="campaign-overlay" />

      <div className="campaign-content">
        <span className="campaign-eyebrow">
          Özel Anlar İçin
        </span>

        <h2 className="campaign-title">
          Sevdiklerinize
          <br />
          Bugün Bir Çiçek Gönderin.
        </h2>

        <p className="campaign-text">
          Aynı gün teslimat seçenekleriyle,
          özel anlarınızı çiçeklerle anlamlandırın.
        </p>

        <Link
          to="/products"
          className="campaign-cta"
        >
          Çiçekleri Keşfet
        </Link>
      </div>
    </section>
  );
}

export default Campaign;