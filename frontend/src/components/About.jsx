import './About.css';

function About() {
  return (
    <section className="about" id="about">
      <div className="about-image-wrapper">
        <img
          src="https://images.unsplash.com/photo-1487070183336-b863922373d4?w=600"
          alt="Bloom Flowers atölyesi"
          className="about-image"
        />
      </div>

      <div className="about-content">
        <h2 className="about-title">Bloom Flowers Hakkında</h2>
        <p className="about-text">
          Bloom Flowers, her buketi özenle hazırlayan butik bir çiçek atölyesidir.
          Taze çiçekler, özgün tasarımlar ve zamanında teslimat anlayışıyla,
          önemli anlarınızı unutulmaz kılmak için buradayız.
        </p>
      </div>
    </section>
  );
}

export default About;