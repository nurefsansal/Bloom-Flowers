import { useState, useEffect } from 'react';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../services/productService';
import { getCategories } from '../../services/categoryService';
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
    imageUrl: '',
    categoryId: '',
  });

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

  function startEdit(product) {
    setEditingId(product.id);

    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stockQuantity: product.stockQuantity,
      imageUrl: product.imageUrl || '',
      categoryId:
        categories.find(
          (category) => category.name === product.categoryName
        )?.id || '',
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  function cancelEdit() {
    setEditingId(null);

    setFormData({
      name: '',
      description: '',
      price: '',
      stockQuantity: '',
      imageUrl: '',
      categoryId: '',
    });

    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

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

      cancelEdit();
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
    return <p>Yükleniyor...</p>;
  }

  return (
    <div className="admin-page">
      <AdminNav />

      <h1>Ürün Yönetimi</h1>

      {error && <p className="admin-error">{error}</p>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <h2>
          {editingId ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
        </h2>

        <input
          name="name"
          placeholder="Ürün Adı"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Açıklama"
          value={formData.description}
          onChange={handleChange}
        />

        <input
          name="price"
          type="number"
          min="0"
          step="0.01"
          placeholder="Fiyat"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <input
          name="stockQuantity"
          type="number"
          min="0"
          placeholder="Stok"
          value={formData.stockQuantity}
          onChange={handleChange}
          required
        />

        <input
          name="imageUrl"
          placeholder="Görsel URL"
          value={formData.imageUrl}
          onChange={handleChange}
          required
        />

        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          required
        >
          <option value="">Kategori Seç</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <div className="admin-form-actions">
          <button type="submit">
            {editingId ? 'Güncelle' : 'Ekle'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
            >
              Vazgeç
            </button>
          )}
        </div>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Ad</th>
            <th>Kategori</th>
            <th>Fiyat</th>
            <th>Stok</th>
            <th>İşlem</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>

              <td>{product.categoryName}</td>

              <td>{product.price} ₺</td>

              <td>{product.stockQuantity}</td>

              <td>
                <button
                  type="button"
                  onClick={() => startEdit(product)}
                >
                  Düzenle
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(product.id)}
                >
                  Sil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminProducts;