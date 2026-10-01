import { useState, useMemo, useEffect } from 'react';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import ProductCard from '../components/ProductCard';
import './Products.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('default');

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError('Ürünler yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'Tümü') {
      result = result.filter((p) => p.categoryName === selectedCategory);
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
  }, [products, selectedCategory, searchTerm, sortOrder]);

  if (loading) {
    return <p className="products-loading">Ürünler yükleniyor...</p>;
  }

  if (error) {
    return <p className="products-error">{error}</p>;
  }

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
          {categories.map((cat) => (
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