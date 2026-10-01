import { useEffect, useState } from 'react';
import { getProducts } from '../services/productService';
import ProductCard from './ProductCard';
import './FeaturedProducts.css';

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError('');

        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Öne çıkan ürünler alınamadı:', error);
        setError('Ürünler yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="featured-products">
        <h2 className="featured-products-title">
          Öne Çıkan Ürünler
        </h2>

        <p>Ürünler yükleniyor...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="featured-products">
        <h2 className="featured-products-title">
          Öne Çıkan Ürünler
        </h2>

        <p>{error}</p>
      </section>
    );
  }

  return (
    <section className="featured-products">
      <h2 className="featured-products-title">
        Öne Çıkan Ürünler
      </h2>

      <div className="featured-products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;

