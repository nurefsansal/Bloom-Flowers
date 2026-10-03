
import { useState, useEffect } from 'react';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../services/productService';
import { getCategories } from '../../services/categoryService';
import { getImageUrl } from '../../utils/getImageUrl';
import AdminNav from '../../components/AdminNav';
import './Admin.css';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    image: null,
    categoryId: '',
  });

  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError('');

      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Admin ürün verileri alınamadı:', err);
      setError('Ürün ve kategori bilgileri alınamadı.');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  }

  function startEdit(product) {
    setEditingId(product.id);

    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stockQuantity: product.stockQuantity,
      image: null,
      categoryId:
        categories.find(
          (category) => category.name === product.categoryName
        )?.id || '',
    });

    setImagePreview(getImageUrl(product.imageUrl));

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  function resetForm() {
    setEditingId(null);

    setFormData({
      name: '',
      description: '',
      price: '',
      stockQuantity: '',
      image: null,
      categoryId: '',
    });

    setImagePreview('');
    setError('');
  }

  function cancelEdit() {
    resetForm();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!editingId && !formData.image) {
      setError('Yeni ürün için bir görsel seçmelisiniz.');
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      stockQuantity: Number(formData.stockQuantity),
      categoryId: Number(formData.categoryId),
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }

      resetForm();
      await loadData();
    } catch (err) {
      console.error('Ürün kaydedilemedi:', err);
      setError(
        err.response?.data?.message ||
          'Ürün kaydedilirken bir hata oluştu.'
      );
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      'Bu ürünü pasif hale getirmek istediğinize emin misiniz?'
    );

    if (!confirmed) {
      return;
    }

    setError('');

    try {
      await deleteProduct(id);
      await loadData();
    } catch (err) {
      console.error('Ürün silinemedi:', err);
      setError(
        err.response?.data?.message ||
          'Ürün silinirken bir hata oluştu.'
      );
    }
  }

  if (loading) {
    return (
      <p className="admin-dashboard-message">
        Ürünler yükleniyor...
      </p>
    );
  }

  return (
    <div className="admin-page admin-products">
      <AdminNav />

      <div className="admin-products-header">
        <div>
          <span className="admin-dashboard-eyebrow">
            Bloom Flowers / Yönetim
          </span>

          <h1 className="admin-dashboard-title">
            Ürünler
          </h1>

          <p className="admin-dashboard-subtitle">
            Mağazanızdaki ürünleri yönetin ve yeni ürünler ekleyin.
          </p>
        </div>

        <div className="admin-products-count">
          <span>{products.length}</span>
          <small>Ürün</small>
        </div>
      </div>

      {error && (
        <p className="admin-error admin-products-error">
          {error}
        </p>
      )}

      <section className="admin-product-form-section">
        <div className="admin-product-section-heading">
          <div>
            <span className="admin-section-eyebrow">
              {editingId ? 'Ürün Düzenleme' : 'Yeni Ürün'}
            </span>

            <h2>
              {editingId
                ? 'Ürün Bilgilerini Güncelle'
                : 'Yeni Ürün Ekle'}
            </h2>
          </div>
        </div>

        <form
          className="admin-product-form"
          onSubmit={handleSubmit}
        >
          <div className="admin-product-form-grid">
            <div className="admin-form-field admin-form-field-wide">
              <label htmlFor="product-name">
                Ürün Adı
              </label>

              <input
                id="product-name"
                name="name"
                placeholder="Örneğin: Beyaz Gül Buketi"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-form-field">
              <label htmlFor="product-category">
                Kategori
              </label>

              <select
                id="product-category"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
              >
                <option value="">
                  Kategori Seç
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-form-field">
              <label htmlFor="product-price">
                Fiyat
              </label>

              <div className="admin-input-with-suffix">
                <input
                  id="product-price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />

                <span>₺</span>
              </div>
            </div>

            <div className="admin-form-field">
              <label htmlFor="product-stock">
                Stok
              </label>

              <input
                id="product-stock"
                name="stockQuantity"
                type="number"
                min="0"
                placeholder="0"
                value={formData.stockQuantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-form-field admin-form-field-wide">
              <label htmlFor="product-image">
                Ürün Görseli
              </label>

              <input
                id="product-image"
                name="image"
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                required={!editingId}
              />

              <small className="admin-form-help">
                JPG, JPEG, PNG veya WEBP · Maksimum 5 MB
              </small>

              {imagePreview && (
                <div className="admin-product-image-preview">
                  <img
                    src={imagePreview}
                    alt="Ürün önizleme"
                  />
                </div>
              )}
            </div>

            <div className="admin-form-field admin-form-field-wide">
              <label htmlFor="product-description">
                Açıklama
              </label>

              <textarea
                id="product-description"
                name="description"
                placeholder="Ürün hakkında kısa bir açıklama..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="admin-product-form-actions">
            <button
              type="submit"
              className="admin-primary-action"
            >
              {editingId
                ? 'Değişiklikleri Kaydet'
                : 'Ürün Ekle'}
            </button>

            {editingId && (
              <button
                type="button"
                className="admin-secondary-action"
                onClick={cancelEdit}
              >
                Vazgeç
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-products-section">
        <div className="admin-product-section-heading">
          <div>
            <span className="admin-section-eyebrow">
              Ürün Kataloğu
            </span>

            <h2>
              Tüm Ürünler
            </h2>
          </div>
        </div>

        <div className="admin-products-table-wrapper">
          <table className="admin-table admin-products-table">
            <thead>
              <tr>
                <th>Ürün</th>
                <th>Kategori</th>
                <th>Fiyat</th>
                <th>Stok</th>
                <th>İşlem</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="admin-product-info">
                      <div className="admin-product-image">
                        {product.imageUrl ? (
                          <img
                            src={getImageUrl(product.imageUrl)}
                            alt={product.name}
                          />
                        ) : (
                          <span>BF</span>
                        )}
                      </div>

                      <div>
                        <span className="admin-product-name">
                          {product.name}
                        </span>

                        {product.description && (
                          <span className="admin-product-description">
                            {product.description}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="admin-product-category">
                      {product.categoryName}
                    </span>
                  </td>

                  <td>
                    <span className="admin-product-price">
                      {product.price} ₺
                    </span>
                  </td>

                  <td>
                    <span
                      className={`admin-stock-status ${
                        product.stockQuantity === 0
                          ? 'out-of-stock'
                          : product.stockQuantity <= 5
                            ? 'low-stock'
                            : 'in-stock'
                      }`}
                    >
                      <span className="admin-stock-dot" />

                      {product.stockQuantity === 0
                        ? 'Tükendi'
                        : `${product.stockQuantity} adet`}
                    </span>
                  </td>

                  <td>
                    <div className="admin-product-actions">
                      <button
                        type="button"
                        className="admin-edit-button"
                        onClick={() => startEdit(product)}
                      >
                        Düzenle
                      </button>

                      <button
                        type="button"
                        className="admin-delete-button"
                        onClick={() => handleDelete(product.id)}
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default AdminProducts;