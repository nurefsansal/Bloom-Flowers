import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../utils/getImageUrl';
import './Cart.css';


function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="cart-page">
      <header className="cart-header">
        <span className="cart-eyebrow">
          01 / YOUR SELECTION
        </span>

        <h1 className="cart-page-title">
          Sepetim
        </h1>

        <p className="cart-intro">
          Seçtiğiniz çiçekler, özel anlarınıza eşlik etmek için hazır.
        </p>
      </header>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <span className="cart-empty-number">01</span>

          <h2>Henüz bir çiçek seçmediniz.</h2>

          <p>
            Bloom koleksiyonunu keşfederek sepetinize
            özel bir dokunuş ekleyin.
          </p>

          <Link to="/products" className="cart-empty-link">
            Koleksiyonu Keşfet
            <span>→</span>
          </Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item, index) => (
              <div className="cart-item" key={item.id}>
                <span className="cart-item-number">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="cart-item-image-wrapper">
                  <img
                      src={getImageUrl(item.imageUrl)}
                      alt={item.name}
                      className="cart-item-image"
                  />
                </div>

                <div className="cart-item-info">
                  <div className="cart-item-heading">
                    <div>
                      <span className="cart-item-label">
                        BLOOM FLOWERS
                      </span>

                      <h2>{item.name}</h2>
                    </div>

                    <p className="cart-item-subtotal">
                      {item.price * item.quantity} ₺
                    </p>
                  </div>

                  <p className="cart-item-unit-price">
                    Birim fiyatı {item.price} ₺
                  </p>

                  <div className="cart-item-actions">
                    <div className="cart-item-quantity">
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(item.id)}
                        disabled={item.quantity === 1}
                        aria-label="Adedi azalt"
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        onClick={() => increaseQuantity(item.id)}
                        disabled={
                          item.quantity === item.stockQuantity
                        }
                        aria-label="Adedi artır"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className="cart-item-remove"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Kaldır
                      <span>×</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="cart-summary">
            <div className="cart-summary-heading">
              <span>YOUR ORDER</span>
              <span>{cartItems.length} ürün</span>
            </div>

            <div className="cart-summary-line">
              <span>Ara toplam</span>
              <span>{totalPrice} ₺</span>
            </div>

            <div className="cart-summary-total">
              <span>Toplam</span>

              <span className="cart-total-price">
                {totalPrice} ₺
              </span>
            </div>

            <Link
              to="/checkout"
              className="cart-checkout-btn"
            >
              <span>Siparişi Tamamla</span>
              <span>→</span>
            </Link>

            <Link
              to="/products"
              className="cart-continue-link"
            >
              Alışverişe devam et
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}

export default Cart;