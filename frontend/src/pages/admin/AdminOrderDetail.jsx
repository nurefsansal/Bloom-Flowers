import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  getOrderByIdAdmin,
  updateOrderStatus,
} from '../../services/orderService';
import AdminNav from '../../components/AdminNav';
import './Admin.css';

const orderStatuses = [
  { value: 'Pending', label: 'Beklemede' },
  { value: 'Confirmed', label: 'Onaylandı' },
  { value: 'Preparing', label: 'Hazırlanıyor' },
  { value: 'OutForDelivery', label: 'Dağıtımda' },
  { value: 'Delivered', label: 'Teslim Edildi' },
  { value: 'Cancelled', label: 'İptal Edildi' },
];

const STATUS_LABELS = {
  Pending: 'Beklemede',
  Confirmed: 'Onaylandı',
  Preparing: 'Hazırlanıyor',
  OutForDelivery: 'Dağıtımda',
  Delivered: 'Teslim Edildi',
  Cancelled: 'İptal Edildi',
};

function formatCurrency(value) {
  return new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(date) {
  if (!date) {
    return '-';
  }

  return new Date(date).toLocaleDateString('tr-TR');
}

function AdminOrderDetail() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true);
        setError('');

        const data = await getOrderByIdAdmin(id);

        setOrder(data);
        setSelectedStatus(data.status);
      } catch (err) {
        console.error('Admin sipariş detayı alınamadı:', err);

        setError(
          err.response?.data?.message ||
            'Sipariş detayı alınırken bir hata oluştu.'
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [id]);

  async function handleStatusSave() {
    if (!selectedStatus || !order) {
      return;
    }

    try {
      setSaving(true);
      setError('');

      const updatedOrder = await updateOrderStatus(
        order.id,
        selectedStatus
      );

      setOrder(updatedOrder);
      setSelectedStatus(updatedOrder.status);
    } catch (err) {
      console.error('Sipariş durumu güncellenemedi:', err);

      setError(
        err.response?.data?.message ||
          'Sipariş durumu güncellenirken bir hata oluştu.'
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-page">
        <AdminNav />

        <p className="admin-dashboard-message">
          Sipariş detayı yükleniyor...
        </p>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="admin-page">
        <AdminNav />

        <p className="admin-error">
          {error}
        </p>

        <Link
          to="/admin/orders"
          className="admin-secondary-action"
        >
          Siparişlere Dön
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="admin-page">
        <AdminNav />

        <p className="admin-error">
          Sipariş bulunamadı.
        </p>

        <Link
          to="/admin/orders"
          className="admin-secondary-action"
        >
          Siparişlere Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="admin-page admin-order-detail">
      <AdminNav />

      <div className="admin-order-detail-header">
        <div>
          <span className="admin-dashboard-eyebrow">
            Bloom Flowers / Yönetim / Sipariş
          </span>

          <h1 className="admin-dashboard-title">
            Sipariş Detayı
          </h1>

          <p className="admin-dashboard-subtitle">
            {order.orderNumber}
          </p>
        </div>

        <Link
          to="/admin/orders"
          className="admin-order-back-link"
        >
          ← Siparişlere Dön
        </Link>
      </div>

      {error && (
        <p className="admin-error">
          {error}
        </p>
      )}

      <section className="admin-order-detail-status">
        <div>
          <span className="admin-section-eyebrow">
            Sipariş Durumu
          </span>

          <strong className="admin-order-status-label">
            {STATUS_LABELS[order.status] || order.status}
          </strong>
        </div>

        <div className="admin-order-status-actions">
          <select
            className="admin-order-status-select"
            value={selectedStatus}
            onChange={(event) => {
              setSelectedStatus(event.target.value);
            }}
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

          <button
            type="button"
            className="admin-order-save-btn"
            onClick={handleStatusSave}
            disabled={
              saving ||
              selectedStatus === order.status
            }
          >
            {saving
              ? 'Kaydediliyor...'
              : 'Durumu Kaydet'}
          </button>
        </div>
      </section>

      <div className="admin-order-detail-grid">
        <section className="admin-order-detail-section">
          <div className="admin-product-section-heading">
            <div>
              <span className="admin-section-eyebrow">
                Müşteri
              </span>

              <h2>
                Müşteri Bilgileri
              </h2>
            </div>
          </div>

          <div className="admin-order-info-list">
            <div className="admin-order-info-row">
              <span>Ad Soyad</span>

              <strong>
                {order.customerName || '-'}
              </strong>
            </div>

            <div className="admin-order-info-row">
              <span>E-posta</span>

              <strong>
                {order.customerEmail || '-'}
              </strong>
            </div>

            <div className="admin-order-info-row">
              <span>Telefon</span>

              <strong>
                {order.deliveryPhoneNumber || '-'}
              </strong>
            </div>
          </div>
        </section>

        <section className="admin-order-detail-section">
          <div className="admin-product-section-heading">
            <div>
              <span className="admin-section-eyebrow">
                Teslimat
              </span>

              <h2>
                Teslimat Bilgileri
              </h2>
            </div>
          </div>

          <div className="admin-order-info-list">
            <div className="admin-order-info-row">
              <span>Şehir</span>

              <strong>
                {order.deliveryCity || '-'}
              </strong>
            </div>

            <div className="admin-order-info-row">
              <span>İlçe</span>

              <strong>
                {order.deliveryDistrict || '-'}
              </strong>
            </div>

            <div className="admin-order-info-row admin-order-info-row-address">
              <span>Adres</span>

              <strong>
                {order.deliveryFullAddress || '-'}
              </strong>
            </div>

            <div className="admin-order-info-row">
              <span>Teslimat Tarihi</span>

              <strong>
                {formatDate(order.deliveryDate)}
              </strong>
            </div>

            <div className="admin-order-info-row">
              <span>Saat Aralığı</span>

              <strong>
                {order.deliveryTimeSlot || '-'}
              </strong>
            </div>
          </div>
        </section>
      </div>

      {order.orderNote && (
        <section className="admin-order-detail-section">
          <div className="admin-product-section-heading">
            <div>
              <span className="admin-section-eyebrow">
                Not
              </span>

              <h2>
                Sipariş Notu
              </h2>
            </div>
          </div>

          <div className="admin-order-note">
            {order.orderNote}
          </div>
        </section>
      )}

      <section className="admin-order-detail-section">
        <div className="admin-product-section-heading">
          <div>
            <span className="admin-section-eyebrow">
              Sipariş İçeriği
            </span>

            <h2>
              Ürünler
            </h2>
          </div>
        </div>

        <div className="admin-products-table-wrapper">
          <table className="admin-table admin-products-table admin-order-items-table">
            <thead>
              <tr>
                <th>Ürün</th>
                <th>Miktar</th>
                <th>Birim Fiyat</th>
                <th>Ara Toplam</th>
              </tr>
            </thead>

            <tbody>
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => {
                  const subtotal =
                    item.unitPrice * item.quantity;

                  return (
                    <tr key={item.productId}>
                      <td>
                        <span className="admin-product-name">
                          {item.productName}
                        </span>
                      </td>

                      <td>
                        {item.quantity} adet
                      </td>

                      <td>
                        <span className="admin-product-price">
                          {formatCurrency(item.unitPrice)} ₺
                        </span>
                      </td>

                      <td>
                        <span className="admin-product-price">
                          {formatCurrency(subtotal)} ₺
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4}>
                    Siparişte ürün bulunmuyor.
                  </td>
                </tr>
              )}
            </tbody>

            <tfoot>
              <tr>
                <td
                  colSpan={3}
                  className="admin-order-total-label"
                >
                  Toplam
                </td>

                <td className="admin-order-total-value">
                  {formatCurrency(order.totalPrice)} ₺
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      <section className="admin-order-meta">
        <span>
          Sipariş tarihi:{' '}
          {formatDate(order.createdAt)}
        </span>
      </section>
    </div>
  );
}

export default AdminOrderDetail;