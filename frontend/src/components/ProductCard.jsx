import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [cartMessage, setCartMessage] = useState('');

  const isOutOfStock = product.stockQuantity === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      return;
    }

    addToCart(product, 1);
    setCartMessage('Ürün sepete eklendi.');

    setTimeout(() => {
      setCartMessage('');
    }, 3000);
  };

  return (
    <div className="product-card">
      <Link
        to={`/products/${product.id}`}
        className="product-card-link"
      >
        <div className="product-card-image-wrapper">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-card-image"
          />

          {isOutOfStock && (
            <span className="product-card-badge">
              Tükendi
            </span>
          )}
        </div>

        <div className="product-card-info">
          <h3 className="product-card-name">
            {product.name}
          </h3>

          <p className="product-card-price">
            {product.price} ₺
          </p>
        </div>
      </Link>

      <button
        className="product-card-btn"
        disabled={isOutOfStock}
        onClick={handleAddToCart}
      >
        {isOutOfStock ? 'Stokta Yok' : 'Sepete Ekle'}
      </button>

      {cartMessage && (
        <p className="product-card-cart-message">
          {cartMessage}
        </p>
      )}
    </div>
  );
}

export default ProductCard;