import { useParams, Link } from 'react-router-dom';
import './OrderConfirmation.css';

function OrderConfirmation() {
  const { orderNumber } = useParams();

  return (
    <main className="order-confirmation-page">
      <section className="order-confirmation-box">
        <span className="order-confirmation-eyebrow">
          BLOOM FLOWERS / ORDER
        </span>

        <div className="order-confirmation-icon" aria-hidden="true">
          ✓
        </div>

        <h1>Siparişiniz Alındı.</h1>

        <p className="order-confirmation-intro">
          Çiçek seçiminiz başarıyla oluşturuldu.
          Siparişiniz hazırlanmaya başladığında durumunu
          hesabınız üzerinden takip edebilirsiniz.
        </p>

        <div className="order-confirmation-number-area">
          <span>SİPARİŞ NUMARASI</span>
          <strong>{orderNumber}</strong>
        </div>

        <p className="order-confirmation-note">
          Siparişinizin tüm detaylarını ve teslimat durumunu
          Siparişlerim sayfasından görüntüleyebilirsiniz.
        </p>

        <div className="order-confirmation-actions">
          <Link to="/orders" className="order-confirmation-btn">
            Siparişlerimi Görüntüle
            <span>→</span>
          </Link>

          <Link to="/products" className="order-confirmation-secondary">
            Koleksiyona Dön
          </Link>
        </div>
      </section>
    </main>
  );
}

export default OrderConfirmation;
