import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../utils/getImageUrl';
import './ProductDetail.css';

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
      <main className="product-detail-message-page">
        <p>Ürün yükleniyor...</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="product-detail-message-page">
        <h1>{error || 'Ürün bulunamadı.'}</h1>
      </main>
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
    }, 2500);
  };

  return (
    <main className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-detail-image-column">
          <div className="product-detail-image-wrapper">
            <img
                src={getImageUrl(product.imageUrl)}
                alt={product.name}
                className="product-detail-image"
            />
          </div>

          <span className="product-detail-image-caption">
            BLOOM FLOWERS / COLLECTION
          </span>
        </div>

        <div className="product-detail-info">
          <div className="product-detail-heading">
            <span className="product-detail-eyebrow">
              {product.categoryName}
            </span>

            <h1 className="product-detail-name">
              {product.name}
            </h1>

            <p className="product-detail-price">
              {product.price} ₺
            </p>
          </div>

          <div className="product-detail-divider" />

          <p className="product-detail-description">
            {product.description}
          </p>

          <div className="product-detail-stock">
            <span className="product-detail-stock-label">
              Durum
            </span>

            {isOutOfStock ? (
              <span className="product-detail-stock-out">
                Tükendi
              </span>
            ) : (
              <span>
                Stokta · {product.stockQuantity} adet
              </span>
            )}
          </div>

          <div className="product-detail-purchase">
            <div className="product-detail-quantity">
              <button
                type="button"
                disabled={isOutOfStock || quantity <= 1}
                onClick={() =>
                  setQuantity((prev) =>
                    Math.max(1, prev - 1)
                  )
                }
                aria-label="Ürün adedini azalt"
              >
                −
              </button>

              <span>{quantity}</span>

              <button
                type="button"
                disabled={
                  isOutOfStock ||
                  quantity >= product.stockQuantity
                }
                onClick={() =>
                  setQuantity((prev) =>
                    Math.min(
                      product.stockQuantity,
                      prev + 1
                    )
                  )
                }
                aria-label="Ürün adedini artır"
              >
                +
              </button>
            </div>

            <button
              type="button"
              className="product-detail-cart-btn"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
            >
              <span>
                {isOutOfStock
                  ? 'Stokta Yok'
                  : 'Sepete Ekle'}
              </span>

              {!isOutOfStock && <span>→</span>}
            </button>
          </div>

          <div className="product-detail-note">
            <span>Bloom Flowers</span>

            <p>
              Her tasarım, sevdiklerinize ulaşmadan önce
              özenle hazırlanır.
            </p>
          </div>
        </div>
      </div>

      {cartMessage && (
        <div className="cart-toast">
          <div className="cart-toast-icon">
            ✓
          </div>

          <div className="cart-toast-text">
            <strong>Sepete eklendi</strong>

            <span>{cartMessage}</span>
          </div>
        </div>
      )}
    </main>
  );
}

export default ProductDetail;