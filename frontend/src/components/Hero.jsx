import './Hero.css';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Her An İçin Bir Çiçek</h1>
        <p className="hero-subtitle">
          Butik tasarımlar, taze çiçekler, aynı gün teslimat.
        </p>
        <button className="hero-cta">Ürünleri Keşfet</button>
      </div>
    </section>
  );
}

export default Hero;