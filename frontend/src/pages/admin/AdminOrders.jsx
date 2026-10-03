import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';
import AdminNav from '../../components/AdminNav';
import './Admin.css';

const orderStatuses = [
  { value: 'Pending', label: 'Bekliyor' },
  { value: 'Confirmed', label: 'Onaylandı' },
  { value: 'Preparing', label: 'Hazırlanıyor' },
  { value: 'OutForDelivery', label: 'Dağıtımda' },
  { value: 'Delivered', label: 'Teslim Edildi' },
  { value: 'Cancelled', label: 'İptal Edildi' },
];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);
      setError('');

      const data = await getAllOrders();
      setOrders(data);

      const statusMap = {};
      data.forEach((order) => {
        statusMap[order.id] = order.status;
      });
      setSelectedStatuses(statusMap);
    } catch (err) {
      console.error('Admin siparişleri alınamadı:', err);
      setError(err.response?.data?.message || 'Siparişler alınırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }

  function handleStatusChange(orderId, status) {
    setSelectedStatuses((prev) => ({ ...prev, [orderId]: status }));
  }

  async function handleSaveStatus(orderId) {
    const status = selectedStatuses[orderId];
    if (!status) return;

    try {
      setSavingId(orderId);
      setError('');

      const updatedOrder = await updateOrderStatus(orderId, status);
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? updatedOrder : order))
      );
    } catch (err) {
      console.error('Sipariş durumu güncellenemedi:', err);
      setError(err.response?.data?.message || 'Sipariş durumu güncellenirken bir hata oluştu.');
    } finally {
      setSavingId(null);
    }
  }

  function formatDate(date) {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('tr-TR');
  }

  if (loading) {
    return <p className="admin-dashboard-message">Siparişler yükleniyor...</p>;
  }

  return (
    <div className="admin-page admin-products">
      <AdminNav />

      <div className="admin-products-header">
        <div>
          <span className="admin-dashboard-eyebrow">Bloom Flowers / Yönetim</span>
          <h1 className="admin-dashboard-title">Siparişler</h1>
          <p className="admin-dashboard-subtitle">
            Gelen siparişleri görüntüleyin ve durumlarını güncelleyin.
          </p>
        </div>

        <div className="admin-products-count">
          <span>{orders.length}</span>
          <small>Sipariş</small>
        </div>
      </div>

      {error && <p className="admin-error admin-products-error">{error}</p>}

      <section className="admin-products-section">
        <div className="admin-product-section-heading">
          <div>
            <span className="admin-section-eyebrow">Sipariş Geçmişi</span>
            <h2>Tüm Siparişler</h2>
          </div>
        </div>

        {orders.length === 0 ? (
          <p className="admin-dashboard-message">Henüz sipariş bulunmuyor.</p>
        ) : (
          <div className="admin-products-table-wrapper">
            <table className="admin-table admin-products-table">
              <thead>
                <tr>
                  <th>Sipariş No</th>
                  <th>Sipariş Tarihi</th>
                  <th>Teslimat Tarihi</th>
                  <th>Saat Aralığı</th>
                  <th>Toplam</th>
                  <th>Durum</th>
                  <th>İşlem</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                <td>
                  <Link
                    to={`/admin/orders/${order.id}`}
                    className="admin-order-number admin-order-link"
                  >
                  {order.orderNumber}
                  </Link>
                </td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>{formatDate(order.deliveryDate)}</td>
                    <td>{order.deliveryTimeSlot}</td>
                    <td className="admin-product-price">{order.totalPrice} ₺</td>
                    <td>
                      <select
                        className="admin-order-status-select"
                        value={selectedStatuses[order.id] || order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        {orderStatuses.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="admin-order-save-btn"
                        onClick={() => handleSaveStatus(order.id)}
                        disabled={savingId === order.id}
                      >
                        {savingId === order.id ? 'Kaydediliyor...' : 'Kaydet'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminOrders;