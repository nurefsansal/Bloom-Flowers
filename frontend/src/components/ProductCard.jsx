import './ProductCard.css';

function ProductCard({ product }) {
  const isOutOfStock = product.stock === 0;

  return (
    <div className="product-card">
      <div className="product-card-image-wrapper">
        <img src={product.imageUrl} alt={product.name} className="product-card-image" />
        {isOutOfStock && <span className="product-card-badge">Tükendi</span>}
      </div>

      <div className="product-card-info">
        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-price">{product.price} ₺</p>

        <button className="product-card-btn" disabled={isOutOfStock}>
          {isOutOfStock ? 'Stokta Yok' : 'Sepete Ekle'}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;