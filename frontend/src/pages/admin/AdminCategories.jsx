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

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function startEdit(category) {
    setEditingId(category.id);

    setFormData({
      name: category.name,
      description: category.description || '',
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
    });

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
        err.response?.data?.message ||
          'Kategori kaydedilirken bir hata oluştu.'
      );
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      'Bu kategoriyi silmek istediğinize emin misiniz?'
    );

    if (!confirmed) {
      return;
    }

    setError('');

    try {
      await deleteCategory(id);
      await loadData();
    } catch (err) {
      console.error('Kategori silinemedi:', err);

      setError(
        err.response?.data?.message ||
          'Kategori silinirken bir hata oluştu.'
      );
    }
  }

  if (loading) {
    return <p>Yükleniyor...</p>;
  }

  return (
    <div className="admin-page">
      <AdminNav />

      <h1>Kategori Yönetimi</h1>

      {error && <p className="admin-error">{error}</p>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <h2>
          {editingId
            ? 'Kategoriyi Düzenle'
            : 'Yeni Kategori Ekle'}
        </h2>

        <input
          name="name"
          placeholder="Kategori Adı"
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
            <th>Açıklama</th>
            <th>İşlem</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.name}</td>

              <td>{category.description}</td>

              <td>
                <button
                  type="button"
                  onClick={() => startEdit(category)}
                >
                  Düzenle
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(category.id)}
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

export default AdminCategories;