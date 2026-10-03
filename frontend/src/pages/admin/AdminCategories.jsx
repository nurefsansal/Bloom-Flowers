import { useState, useEffect } from 'react';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../services/categoryService';
import AdminNav from '../../components/AdminNav';
import './Admin.css';

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
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

      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Kategoriler alınamadı:', err);
      setError('Kategoriler alınamadı.');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function startEdit(category) {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      description: category.description || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditingId(null);
    setFormData({ name: '', description: '' });
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        await updateCategory(editingId, formData);
      } else {
        await createCategory(formData);
      }

      cancelEdit();
      await loadData();
    } catch (err) {
      console.error('Kategori kaydedilemedi:', err);
      setError(
        err.response?.data?.message || 'Kategori kaydedilirken bir hata oluştu.'
      );
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm('Bu kategoriyi silmek istediğinize emin misiniz?');
    if (!confirmed) return;

    setError('');

    try {
      await deleteCategory(id);
      await loadData();
    } catch (err) {
      console.error('Kategori silinemedi:', err);
      setError(
        err.response?.data?.message || 'Kategori silinirken bir hata oluştu.'
      );
    }
  }

  if (loading) {
    return <p className="admin-dashboard-message">Kategoriler yükleniyor...</p>;
  }

  return (
    <div className="admin-page admin-products">
      <AdminNav />

      <div className="admin-products-header">
        <div>
          <span className="admin-dashboard-eyebrow">Bloom Flowers / Yönetim</span>
          <h1 className="admin-dashboard-title">Kategoriler</h1>
          <p className="admin-dashboard-subtitle">
            Mağazanızdaki kategorileri yönetin ve yeni kategoriler ekleyin.
          </p>
        </div>

        <div className="admin-products-count">
          <span>{categories.length}</span>
          <small>Kategori</small>
        </div>
      </div>

      {error && <p className="admin-error admin-products-error">{error}</p>}

      <section className="admin-product-form-section">
        <div className="admin-product-section-heading">
          <div>
            <span className="admin-section-eyebrow">
              {editingId ? 'Kategori Düzenleme' : 'Yeni Kategori'}
            </span>
            <h2>{editingId ? 'Kategori Bilgilerini Güncelle' : 'Yeni Kategori Ekle'}</h2>
          </div>
        </div>

        <form className="admin-product-form" onSubmit={handleSubmit}>
          <div className="admin-product-form-grid">
            <div className="admin-form-field admin-form-field-wide">
              <label htmlFor="category-name">Kategori Adı</label>
              <input
                id="category-name"
                name="name"
                placeholder="Örneğin: Buketler"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-form-field admin-form-field-wide">
              <label htmlFor="category-description">Açıklama</label>
              <textarea
                id="category-description"
                name="description"
                placeholder="Kategori hakkında kısa bir açıklama..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="admin-product-form-actions">
            <button type="submit" className="admin-primary-action">
              {editingId ? 'Değişiklikleri Kaydet' : 'Kategori Ekle'}
            </button>

            {editingId && (
              <button type="button" className="admin-secondary-action" onClick={cancelEdit}>
                Vazgeç
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-products-section">
        <div className="admin-product-section-heading">
          <div>
            <span className="admin-section-eyebrow">Kategori Listesi</span>
            <h2>Tüm Kategoriler</h2>
          </div>
        </div>

        <div className="admin-products-table-wrapper">
          <table className="admin-table admin-products-table">
            <thead>
              <tr>
                <th>Ad</th>
                <th>Açıklama</th>
                <th>İşlem</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>
                    <span className="admin-product-name">{category.name}</span>
                  </td>

                  <td>
                    <span className="admin-product-description" style={{ maxWidth: 'none', whiteSpace: 'normal' }}>
                      {category.description}
                    </span>
                  </td>

                  <td>
                    <div className="admin-product-actions">
                      <button
                        type="button"
                        className="admin-edit-button"
                        onClick={() => startEdit(category)}
                      >
                        Düzenle
                      </button>

                      <button
                        type="button"
                        className="admin-delete-button"
                        onClick={() => handleDelete(category.id)}
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

export default AdminCategories;