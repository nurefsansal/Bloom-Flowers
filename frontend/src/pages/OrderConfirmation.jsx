import { useParams, Link } from 'react-router-dom';
import './OrderConfirmation.css';

function OrderConfirmation() {
  const { orderNumber } = useParams();

  return (
    <div className="order-confirmation-page">
      <div className="order-confirmation-box">
        <span className="order-confirmation-icon">✓</span>
        <h1>Siparişiniz Alındı!</h1>
        <p>Sipariş numaranız:</p>
        <p className="order-confirmation-number">{orderNumber}</p>
        <p className="order-confirmation-note">
          Siparişinizin durumunu "Siparişlerim" sayfasından takip edebilirsiniz.
        </p>
        <Link to="/orders" className="order-confirmation-btn">
          Siparişlerimi Görüntüle
        </Link>
      </div>
    </div>
  );
}

export default OrderConfirmation;