import { useState, useMemo } from 'react';
import { mockProducts } from '../services/mockProducts';
import { mockCategories } from '../services/mockCategories';
import ProductCard from '../components/ProductCard';
import './Products.css';

function Products() {
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('default');

  const filteredProducts = useMemo(() => {
    let result = [...mockProducts];

    if (selectedCategory !== 'Tümü') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchTerm.trim() !== '') {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortOrder === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [selectedCategory, searchTerm, sortOrder]);

  return (
    <div className="products-page">
      <h1 className="products-page-title">Ürünlerimiz</h1>

      <div className="products-filters">
        <input
          type="text"
          placeholder="Ürün ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="products-search"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="products-select"
        >
          <option value="Tümü">Tüm Kategoriler</option>
          {mockCategories.map((cat) => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="products-select"
        >
          <option value="default">Sıralama</option>
          <option value="price-asc">Fiyat: Artan</option>
          <option value="price-desc">Fiyat: Azalan</option>
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="products-empty">Aradığınız kriterlere uygun ürün bulunamadı.</p>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;