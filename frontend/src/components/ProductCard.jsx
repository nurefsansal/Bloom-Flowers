import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-card-link">
        <div className="product-card-image-wrapper">
          <img src={product.imageUrl} alt={product.name} className="product-card-image" />
          {isOutOfStock && <span className="product-card-badge">Tükendi</span>}
        </div>

        <div className="product-card-info">
          <h3 className="product-card-name">{product.name}</h3>
          <p className="product-card-price">{product.price} ₺</p>
        </div>
      </Link>

      <button
        className="product-card-btn"
        disabled={isOutOfStock}
        onClick={handleAddToCart}
      >
        {isOutOfStock ? 'Stokta Yok' : 'Sepete Ekle'}
      </button>
    </div>
  );
}

export default ProductCard;