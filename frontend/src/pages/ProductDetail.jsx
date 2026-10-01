import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../services/productService';
import './ProductDetail.css';
import { useCart } from '../context/CartContext';

function ProductDetail() {
  const { addToCart } = useCart();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartMessage, setCartMessage] = useState('');

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        setError('');
        setCartMessage('');

        const data = await getProductById(id);

        setProduct(data);
        setQuantity(data.stockQuantity > 0 ? 1 : 0);
      } catch (error) {
        console.error('Ürün detayı alınamadı:', error);
        setError('Ürün bilgileri alınırken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="product-detail-not-found">
        <h1>Ürün yükleniyor...</h1>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-not-found">
        <h1>{error || 'Ürün bulunamadı.'}</h1>
      </div>
    );
  }

  const isOutOfStock = product.stockQuantity === 0;

  const handleAddToCart = () => {
    if (isOutOfStock || quantity <= 0) {
      return;
    }

    addToCart(product, quantity);
    setCartMessage('Ürün sepete eklendi.');

    setTimeout(() => {
      setCartMessage('');
    }, 3000);
  };

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">

        <div className="product-detail-image-wrapper">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-detail-image"
          />
        </div>

        <div className="product-detail-info">
          <p className="product-detail-category">
            {product.categoryName}
          </p>

          <h1 className="product-detail-name">
            {product.name}
          </h1>

          <p className="product-detail-price">
            {product.price} ₺
          </p>

          <p className="product-detail-description">
            {product.description}
          </p>

          <p className="product-detail-stock">
            Stok: {product.stockQuantity}
          </p>

          <div className="product-detail-quantity">
            <button
              disabled={isOutOfStock || quantity <= 1}
              onClick={() =>
                setQuantity((prev) => Math.max(1, prev - 1))
              }
            >
              -
            </button>

            <span>{quantity}</span>

            <button
              disabled={
                isOutOfStock ||
                quantity >= product.stockQuantity
              }
              onClick={() =>
                setQuantity((prev) =>
                  Math.min(product.stockQuantity, prev + 1)
                )
              }
            >
              +
            </button>
          </div>

          <button
            className="product-detail-cart-btn"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
          >
            {isOutOfStock
              ? 'Stokta Yok'
              : 'Sepete Ekle'}
          </button>

          {cartMessage && (
            <p className="product-detail-cart-message">
              {cartMessage}
            </p>
          )}

        </div>

      </div>
    </div>
  );
}

export default ProductDetail;