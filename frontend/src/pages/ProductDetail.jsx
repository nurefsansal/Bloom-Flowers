import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { mockProducts } from '../services/mockProducts';
import './ProductDetail.css';
import { useCart } from '../context/CartContext';

function ProductDetail() {
  const { addToCart } = useCart();
  const { id } = useParams();

  const product = mockProducts.find(
    (product) => product.id === Number(id)
  );

  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="product-detail-not-found">
        <h1>Ürün bulunamadı.</h1>
      </div>
    );
  }

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
            {product.category}
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
            Stok: {product.stock}
          </p>

          <div className="product-detail-quantity">
            <button
              onClick={() =>
                setQuantity((prev) => Math.max(1, prev - 1))
              }
            >
              -
            </button>

            <span>{quantity}</span>

            <button
              onClick={() =>
                setQuantity((prev) =>
                  Math.min(product.stock, prev + 1)
                )
              }
            >
              +
            </button>
          </div>

          <button
            className="product-detail-cart-btn"
            disabled={product.stock === 0}
            onClick={() => addToCart(product, quantity)}
          >
            {product.stock === 0 ? 'Stokta Yok' : 'Sepete Ekle'}
          </button>
        </div>

      </div>
    </div>
  );
}

export default ProductDetail;
