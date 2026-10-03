import { mockGalleryImages } from '../services/mockGallery';
import './Gallery.css';

function Gallery() {
  return (
    <section className="gallery">
      <div className="gallery-heading">
        <div>
          <span className="gallery-eyebrow">
            Bloom'dan kareler
          </span>

          <h2 className="gallery-title">
            Çiçeklerin Arasından.
          </h2>
        </div>

        <p className="gallery-intro">
          Atölyemizden, buketlerimizden ve
          Bloom'un renkli dünyasından küçük anlar.
        </p>
      </div>

      <div className="gallery-grid">
        {mockGalleryImages.map((item, index) => (
          <div
            className={`gallery-item gallery-item-${index + 1}`}
            key={item.id}
          >
            <img
              src={item.imageUrl}
              alt="Bloom Flowers galeri"
              className="gallery-image"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default Gallery;