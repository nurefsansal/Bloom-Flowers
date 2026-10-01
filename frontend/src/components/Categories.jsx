import { useEffect, useState } from 'react';
import { getCategories } from '../services/categoryService';
import CategoryCard from './CategoryCard';
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
        <h2 className="categories-title">Kategoriler</h2>

        <p>Kategoriler yükleniyor...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="categories">
        <h2 className="categories-title">Kategoriler</h2>

        <p>{error}</p>
      </section>
    );
  }

  return (
    <section className="categories">
      <h2 className="categories-title">Kategoriler</h2>

      <div className="categories-grid">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
          />
        ))}
      </div>
    </section>
  );
}

export default Categories;

