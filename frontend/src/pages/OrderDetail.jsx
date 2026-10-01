import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../services/orderService';
import './OrderDetail.css';

const STATUS_LABELS = {
  Pending: 'Beklemede',
  Confirmed: 'Onaylandı',
  Preparing: 'Hazırlanıyor',
  OutForDelivery: 'Dağıtımda',
  Delivered: 'Teslim Edildi',
  Cancelled: 'İptal Edildi',
};

function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [id]);

  if (loading) {
    return <p className="order-detail-loading">Yükleniyor...</p>;
  }

  if (notFound || !order) {
    return (
      <div className="order-detail-not-found">
        <h1>Sipariş bulunamadı.</h1>
        <Link to="/orders">Siparişlerime dön</Link>
      </div>
    );
  }

  return (
    <div className="order-detail-page">
      <Link to="/orders" className="order-detail-back">← Siparişlerime dön</Link>

      <div className="order-detail-header">
        <h1>{order.orderNumber}</h1>
        <span className={`order-status order-status-${order.status.toLowerCase()}`}>
          {STATUS_LABELS[order.status] || order.status}
        </span>
      </div>

      <div className="order-detail-section">
        <h2>Teslimat Bilgileri</h2>
        <p>{order.deliveryCity} / {order.deliveryDistrict}</p>
        <p>{order.deliveryFullAddress}</p>
        <p>Tarih: {new Date(order.deliveryDate).toLocaleDateString('tr-TR')}</p>
        <p>Saat: {order.deliveryTimeSlot}</p>
        {order.orderNote && <p>Not: {order.orderNote}</p>}
      </div>

      <div className="order-detail-section">
        <h2>Ürünler</h2>
        {order.items.map((item) => (
          <div className="order-detail-item" key={item.productId}>
            <span>{item.productName} × {item.quantity}</span>
            <span>{item.unitPrice * item.quantity} ₺</span>
          </div>
        ))}
      </div>

      <div className="order-detail-total">
        <span>Toplam</span>
        <span>{order.totalPrice} ₺</span>
      </div>
    </div>
  );
}

export default OrderDetail;