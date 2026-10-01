import { useEffect, useState } from 'react';
import {
  getAllOrders,
  updateOrderStatus,
} from '../../services/orderService';
import AdminNav from '../../components/AdminNav';
import './Admin.css';

const orderStatuses = [
  {
    value: 'Pending',
    label: 'Bekliyor',
  },
  {
    value: 'Confirmed',
    label: 'Onaylandı',
  },
  {
    value: 'Preparing',
    label: 'Hazırlanıyor',
  },
  {
    value: 'OutForDelivery',
    label: 'Dağıtımda',
  },
  {
    value: 'Delivered',
    label: 'Teslim Edildi',
  },
  {
    value: 'Cancelled',
    label: 'İptal Edildi',
  },
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

      setError(
        err.response?.data?.message ||
          'Siparişler alınırken bir hata oluştu.'
      );
    } finally {
      setLoading(false);
    }
  }

  function handleStatusChange(orderId, status) {
    setSelectedStatuses((prev) => ({
      ...prev,
      [orderId]: status,
    }));
  }

  async function handleSaveStatus(orderId) {
    const status = selectedStatuses[orderId];

    if (!status) {
      return;
    }

    try {
      setSavingId(orderId);
      setError('');

      const updatedOrder = await updateOrderStatus(
        orderId,
        status
      );

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? updatedOrder
            : order
        )
      );
    } catch (err) {
      console.error(
        'Sipariş durumu güncellenemedi:',
        err
      );

      setError(
        err.response?.data?.message ||
          'Sipariş durumu güncellenirken bir hata oluştu.'
      );
    } finally {
      setSavingId(null);
    }
  }

  function formatDate(date) {
    if (!date) {
      return '-';
    }

    return new Date(date).toLocaleDateString('tr-TR');
  }

  if (loading) {
    return (
      <div className="admin-page">
        <AdminNav />

        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <AdminNav />

      <h1>Sipariş Yönetimi</h1>

      {error && (
        <p className="admin-error">
          {error}
        </p>
      )}

      {orders.length === 0 ? (
        <p>Henüz sipariş bulunmuyor.</p>
      ) : (
        <table className="admin-table">
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
                <td>{order.orderNumber}</td>

                <td>
                  {formatDate(order.createdAt)}
                </td>

                <td>
                  {formatDate(order.deliveryDate)}
                </td>

                <td>
                  {order.deliveryTimeSlot}
                </td>

                <td>
                  {order.totalPrice} ₺
                </td>

                <td>
                  <select
                    value={
                      selectedStatuses[order.id] ||
                      order.status
                    }
                    onChange={(e) =>
                      handleStatusChange(
                        order.id,
                        e.target.value
                      )
                    }
                  >
                    {orderStatuses.map((status) => (
                      <option
                        key={status.value}
                        value={status.value}
                      >
                        {status.label}
                      </option>
                    ))}
                  </select>
                </td>

                <td>
                  <button
                    type="button"
                    onClick={() =>
                      handleSaveStatus(order.id)
                    }
                    disabled={
                      savingId === order.id
                    }
                  >
                    {savingId === order.id
                      ? 'Kaydediliyor...'
                      : 'Kaydet'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminOrders;