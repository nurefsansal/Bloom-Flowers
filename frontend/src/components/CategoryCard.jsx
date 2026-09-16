import './CategoryCard.css';

function CategoryCard({ category }) {
  return (
    <div className="category-card">
      <img src={category.imageUrl} alt={category.name} className="category-card-image" />
      <div className="category-card-overlay">
        <span className="category-card-name">{category.name}</span>
      </div>
    </div>
  );
}

export default CategoryCard;