import { mockCategories } from '../services/mockCategories';
import CategoryCard from './CategoryCard';
import './Categories.css';

function Categories() {
  return (
    <section className="categories">
      <h2 className="categories-title">Kategoriler</h2>

      <div className="categories-grid">
        {mockCategories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}

export default Categories;