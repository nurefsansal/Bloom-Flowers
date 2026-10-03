import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getOrders } from '../services/orderService';
import './Orders.css';

const STATUS_LABELS = {
  Pending: 'Beklemede',
  Confirmed: 'Onaylandı',
  Preparing: 'Hazırlanıyor',
  OutForDelivery: 'Dağıtımda',
  Delivered: 'Teslim Edildi',
  Cancelled: 'İptal Edildi',
};

function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    async function fetchOrders() {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch {
        setError('Siparişler yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user, navigate]);

  if (loading) {
    return (
      <main className="orders-message-page">
        <p>Siparişleriniz yükleniyor...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="orders-message-page">
        <p className="orders-error">{error}</p>
      </main>
    );
  }

  return (
    <main className="orders-page">
      <header className="orders-header">
        <span className="orders-eyebrow">BLOOM FLOWERS / ACCOUNT</span>

        <h1 className="orders-title">Siparişlerim</h1>

        <p className="orders-intro">
          Bloom koleksiyonundan seçtiğiniz çiçeklerin
          sipariş durumlarını buradan takip edebilirsiniz.
        </p>
      </header>

      {orders.length === 0 ? (
        <section className="orders-empty">
          <span className="orders-empty-eyebrow">
            BLOOM COLLECTION
          </span>

          <h2>Henüz bir siparişiniz bulunmuyor.</h2>

          <p>
            Size özel hazırlanan çiçek tasarımlarını
            keşfederek ilk siparişinizi oluşturabilirsiniz.
          </p>

          <Link to="/products" className="orders-empty-link">
            Koleksiyonu Keşfet
            <span>→</span>
          </Link>
        </section>
      ) : (
        <section className="orders-content">
          <div className="orders-list-heading">
            <span>SİPARİŞ GEÇMİŞİ</span>
            <span>{orders.length} sipariş</span>
          </div>

          <div className="orders-list">
            {orders.map((order, index) => (
              <Link
                to={`/orders/${order.id}`}
                key={order.id}
                className="order-card"
              >
                <span className="order-index">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="order-card-main">
                  <span className="order-card-label">
                    SİPARİŞ NUMARASI
                  </span>

                  <span className="order-number">
                    {order.orderNumber}
                  </span>

                  <span className="order-date">
                    {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>

                <div className="order-card-status">
                  <span className="order-card-label">
                    DURUM
                  </span>

                  <span
                    className={`order-status order-status-${order.status.toLowerCase()}`}
                  >
                    {STATUS_LABELS[order.status] || order.status}
                  </span>
                </div>

                <div className="order-card-total">
                  <span className="order-card-label">
                    TOPLAM
                  </span>

                  <span className="order-total">
                    {order.totalPrice} ₺
                  </span>
                </div>

                <span className="order-card-arrow">→</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default Orders;

