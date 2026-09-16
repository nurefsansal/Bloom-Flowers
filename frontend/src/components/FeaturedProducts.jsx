import { mockProducts } from '../services/mockProducts';
import ProductCard from './ProductCard';
import './FeaturedProducts.css';

function FeaturedProducts() {
  return (
    <section className="featured-products">
      <h2 className="featured-products-title">Öne Çıkan Ürünler</h2>

      <div className="featured-products-grid">
        {mockProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;