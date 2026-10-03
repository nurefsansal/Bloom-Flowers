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
        console.error('Ürünler alınamadı:', err);
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
      result = result.filter(
        (product) => product.categoryName === selectedCategory
      );
    }

    if (searchTerm.trim() !== '') {
      result = result.filter((product) =>
        product.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
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
    return (
      <main className="products-page">
        <div className="products-page-heading">
          <span className="products-eyebrow">
            Bloom koleksiyonu
          </span>

          <h1 className="products-page-title">
            Çiçekler & Tasarımlar
          </h1>

          <p className="products-page-intro">
            Mevsimin en güzel çiçeklerinden özenle hazırlanan
            Bloom tasarımlarını keşfedin.
          </p>
        </div>

        <p className="products-message">
          Ürünler yükleniyor...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="products-page">
        <div className="products-page-heading">
          <span className="products-eyebrow">
            Bloom koleksiyonu
          </span>

          <h1 className="products-page-title">
            Çiçekler & Tasarımlar
          </h1>
        </div>

        <p className="products-message products-error">
          {error}
        </p>
      </main>
    );
  }

  return (
    <main className="products-page">
      <header className="products-page-heading">
        <span className="products-eyebrow">
          Bloom koleksiyonu
        </span>

        <h1 className="products-page-title">
          Çiçekler & Tasarımlar
        </h1>

        <p className="products-page-intro">
          Mevsimin en güzel çiçeklerinden özenle hazırlanan
          Bloom tasarımlarını keşfedin.
        </p>
      </header>

      <section className="products-toolbar">
        <div className="products-result-count">
          <span className="products-result-number">
            {filteredProducts.length}
          </span>

          <span>ürün</span>
        </div>

        <div className="products-filters">
          <div className="products-search-wrapper">
            <label htmlFor="product-search">
              Ara
            </label>

            <input
              id="product-search"
              type="text"
              placeholder="Çiçek ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="products-search"
            />
          </div>

          <div className="products-select-wrapper">
            <label htmlFor="category-filter">
              Kategori
            </label>

            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="products-select"
            >
              <option value="Tümü">
                Tüm Kategoriler
              </option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.name}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="products-select-wrapper">
            <label htmlFor="sort-filter">
              Sırala
            </label>

            <select
              id="sort-filter"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="products-select"
            >
              <option value="default">
                Varsayılan
              </option>

              <option value="price-asc">
                Fiyat: Artan
              </option>

              <option value="price-desc">
                Fiyat: Azalan
              </option>
            </select>
          </div>
        </div>
      </section>

      {filteredProducts.length === 0 ? (
        <div className="products-empty">
          <span className="products-empty-eyebrow">
            Bloom koleksiyonu
          </span>

          <h2>
            Aradığınız çiçek bulunamadı.
          </h2>

          <p>
            Farklı bir arama veya kategori deneyebilirsiniz.
          </p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default Products;