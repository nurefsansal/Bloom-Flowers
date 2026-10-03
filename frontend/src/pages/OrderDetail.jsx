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
    return (
      <main className="order-detail-message">
        <p>Sipariş bilgileriniz yükleniyor...</p>
      </main>
    );
  }

  if (notFound || !order) {
    return (
      <main className="order-detail-message">
        <div className="order-detail-not-found">
          <span className="order-detail-eyebrow">BLOOM FLOWERS / ORDER</span>
          <h1>Sipariş bulunamadı.</h1>
          <p>Aradığınız sipariş bilgilerine şu anda ulaşılamıyor.</p>
          <Link to="/orders" className="order-detail-back-link">
            Siparişlerime Dön <span>→</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="order-detail-page">
      <Link to="/orders" className="order-detail-back">
        <span>←</span> Siparişlerime dön
      </Link>

      <header className="order-detail-header">
        <div>
          <span className="order-detail-eyebrow">BLOOM FLOWERS / SİPARİŞ DETAYI </span>
          <h1>{order.orderNumber}</h1>
          <p className="order-detail-intro">
            Siparişinizin teslimat ve ürün bilgilerini buradan inceleyebilirsiniz.
          </p>
        </div>

        <span className={`order-status order-status-${order.status.toLowerCase()}`}>
          {STATUS_LABELS[order.status] || order.status}
        </span>
      </header>

      <div className="order-detail-content">
        <section className="order-detail-section">
          <div className="order-detail-section-heading">
            <span className="order-detail-section-number">01</span>
            <h2>Teslimat Bilgileri</h2>
          </div>

          <div className="order-detail-delivery">
            <div className="order-detail-info-row">
              <span>Adres</span>
              <p>{order.deliveryCity} / {order.deliveryDistrict}</p>
            </div>

            <div className="order-detail-info-row">
              <span>Açık adres</span>
              <p>{order.deliveryFullAddress}</p>
            </div>

            <div className="order-detail-info-grid">
              <div className="order-detail-info-row">
                <span>Teslimat tarihi</span>
                <p>{new Date(order.deliveryDate).toLocaleDateString('tr-TR')}</p>
              </div>

              <div className="order-detail-info-row">
                <span>Teslimat saati</span>
                <p>{order.deliveryTimeSlot}</p>
              </div>
            </div>

            {order.orderNote && (
              <div className="order-detail-info-row order-detail-note">
                <span>Sipariş notu</span>
                <p>{order.orderNote}</p>
              </div>
            )}
          </div>
        </section>

        <section className="order-detail-section">
          <div className="order-detail-section-heading">
            <span className="order-detail-section-number">02</span>
            <h2>Sipariş İçeriği</h2>
          </div>

          <div className="order-detail-items">
            {order.items.map((item) => (
              <div className="order-detail-item" key={item.productId}>
                <div className="order-detail-item-info">
                  <span className="order-detail-item-name">{item.productName}</span>
                  <span className="order-detail-item-quantity">
                    {item.quantity} adet × {item.unitPrice} ₺
                  </span>
                </div>

                <span className="order-detail-item-price">
                  {item.unitPrice * item.quantity} ₺
                </span>
              </div>
            ))}
          </div>

          <div className="order-detail-total">
            <span>Genel Toplam</span>
            <strong>{order.totalPrice} ₺</strong>
          </div>
        </section>
      </div>

      <footer className="order-detail-footer">
        <span>Her dal bir hikâye anlatır.</span>
        <Link to="/products">Koleksiyonu keşfet →</Link>
      </footer>
    </main>
  );
}

export default OrderDetail;

