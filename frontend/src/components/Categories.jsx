import { useEffect, useState } from 'react';
import { getCategories } from '../services/categoryService';
import './Categories.css';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        setError('');

        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Kategoriler alınamadı:', error);
        setError('Kategoriler yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="categories">
        <div className="categories-heading">
          <div>
            <span className="categories-eyebrow">
              Çiçek dünyasını keşfet
            </span>

            <h2 className="categories-title">
              Kategoriler
            </h2>
          </div>
        </div>

        <p className="categories-message">
          Kategoriler yükleniyor...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="categories">
        <div className="categories-heading">
          <div>
            <span className="categories-eyebrow">
              Çiçek dünyasını keşfet
            </span>

            <h2 className="categories-title">
              Kategoriler
            </h2>
          </div>
        </div>

        <p className="categories-message">
          {error}
        </p>
      </section>
    );
  }

  return (
    <section className="categories">
      <div className="categories-heading">
        <div>
          <span className="categories-eyebrow">
            Çiçek dünyasını keşfet
          </span>

          <h2 className="categories-title">
            Kategoriler
          </h2>
        </div>

        <p className="categories-intro">
          Her duyguya, her ana ve her hikâyeye
          eşlik eden özel çiçekler.
        </p>
      </div>

      <div className="categories-list">
        {categories.map((category, index) => (
          <div
            className="category-row"
            key={category.id}
          >
            <span className="category-index">
              {String(index + 1).padStart(2, '0')}
            </span>

            <div className="category-row-image-wrapper">
              <img
                src={category.imageUrl}
                alt={category.name}
                className="category-row-image"
              />
            </div>

            <span className="category-row-name">
              {category.name}
            </span>

            <span className="category-row-arrow">
              →
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Categories;