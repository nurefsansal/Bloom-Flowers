import { mockGalleryImages } from '../services/mockGallery';
import './Gallery.css';

function Gallery() {
  return (
    <section className="gallery">
      <h2 className="gallery-title">Bizden Kareler</h2>

      <div className="gallery-grid">
        {mockGalleryImages.map((item) => (
          <img
            key={item.id}
            src={item.imageUrl}
            alt="Bloom Flowers galeri"
            className="gallery-image"
          />
        ))}
      </div>
    </section>
  );
}

export default Gallery;