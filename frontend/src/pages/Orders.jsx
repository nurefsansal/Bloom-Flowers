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
    return <p className="orders-loading">Yükleniyor...</p>;
  }

  if (error) {
    return <p className="orders-error">{error}</p>;
  }

  return (
    <div className="orders-page">
      <h1 className="orders-title">Siparişlerim</h1>

      {orders.length === 0 ? (
        <p className="orders-empty">Henüz bir siparişiniz bulunmuyor.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <Link
              to={`/orders/${order.id}`}
              key={order.id}
              className="order-card"
            >
              <div className="order-card-header">
                <span className="order-number">{order.orderNumber}</span>
                <span className={`order-status order-status-${order.status.toLowerCase()}`}>
                  {STATUS_LABELS[order.status] || order.status}
                </span>
              </div>
              <div className="order-card-body">
                <span>{new Date(order.createdAt).toLocaleDateString('tr-TR')}</span>
                <span className="order-total">{order.totalPrice} ₺</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;