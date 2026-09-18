import { useCart } from '../context/CartContext';
import './Cart.css';

function Cart() {
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-page">
      <h1 className="cart-page-title">Sepetim</h1>

      {cartItems.length === 0 ? (
        <p className="cart-empty">Sepetinizde ürün bulunmuyor.</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.imageUrl} alt={item.name} className="cart-item-image" />

                <div className="cart-item-info">
                  <h2>{item.name}</h2>
                  <p>{item.price} ₺</p>

                  <div className="cart-item-quantity">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      disabled={item.quantity === 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      disabled={item.quantity === item.stock}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="cart-item-remove"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Kaldır
                  </button>
                </div>

                <p className="cart-item-subtotal">
                  {item.price * item.quantity} ₺
                </p>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <span>Toplam:</span>
            <span className="cart-total-price">{totalPrice} ₺</span>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;