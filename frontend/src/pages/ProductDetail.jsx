import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { LuPackageCheck } from "react-icons/lu";
import { getCategorySlug, getProductId, normalizeProductsResponse } from '../utils/api';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useApp();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Sample reviews
  const reviews = [
    { id: '1', user: 'John D.', rating: 5, comment: 'Excellent product! Exactly as described and fast shipping.', date: '2024-01-15' },
    { id: '2', user: 'Sarah M.', rating: 5, comment: 'Best purchase ever! Highly recommend to everyone.', date: '2024-01-10' },
    { id: '3', user: 'Mike R.', rating: 4, comment: 'Great value for money. Will buy again.', date: '2024-01-05' }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      const data = await response.json();
      setProduct(data);

      // Set default selections
      if (data.sizes && data.sizes.length > 0) {
        setSelectedSize(data.sizes[0]);
      }
      if (data.colors && data.colors.length > 0) {
        setSelectedColor(data.colors[0]);
      }

      // Fetch related products
      const relatedRes = await fetch(`/api/products?category=${data.category}`);
      const relatedData = normalizeProductsResponse(await relatedRes.json());
      setRelatedProducts(
        relatedData.filter((item) => getProductId(item) !== getProductId(data)).slice(0, 4)
      );
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (product) {
      await addToCart(product, quantity, selectedSize, selectedColor);
    }
  };

  const handleOrder = async () => {
    if (product) {
      await addToCart(product, quantity, selectedSize, selectedColor);
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '60vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <Link to="/products" className="btn btn-primary mt-3">Back to Products</Link>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
          <span>/</span>
          <Link to={`/products?category=${getCategorySlug(product.category)}`}>{product.category}</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        {/* Main Content */}
        <div className="detail-main">
          {/* Image Gallery */}
          <div className="detail-gallery">
            <div className="main-image">
              <img src={product.images[selectedImageIndex]} alt={product.name} />
              {product.originalPrice > product.price && (
                <span className="detail-badge">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>
            <div className="thumbnail-list">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  className={`thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img src={img} alt={`${product.name} ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="detail-info">
            <span className="detail-category">{product.category}</span>
            <h1 className="detail-title">{product.name}</h1>
            
            <div className="detail-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ color: i < Math.floor(product.rating) ? '#ffc107' : '#444' }}>★</span>
                ))}
              </div>
              <span>{product.rating}</span>
              <span className="reviews">({product.reviews} reviews)</span>
            </div>

            <div className="detail-price">
              <span className="price">₹{(product.price * 83).toFixed(0)}</span>
              {product.originalPrice > product.price && (
                <span className="original-price">₹{(product.originalPrice * 83).toFixed(0)}</span>
              )}
            </div>

            <p className="detail-description">{product.description}</p>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="option-group">
                <label>Size:</label>
                <div className="option-buttons">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      className={`option-btn ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="option-group">
                <label>Color:</label>
                <div className="option-buttons">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      className={`option-btn ${selectedColor === color ? 'active' : ''}`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="option-group">
              <label>Quantity:</label>
              <div className="quantity-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
              </div>
            </div>

            {/* Stock Status */}
            <div className="stock-status">
              {product.stock > 0 ? (
                <span className="in-stock">✓ In Stock ({product.stock} available)</span>
              ) : (
                <span className="out-of-stock">✕ Out of Stock</span>
              )}
            </div>

            {/* Add to Cart */}
            <div className="detail-actions">
              <button className="btn btn-primary btn-lg w-full" onClick={handleAddToCart}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                Add to Cart
              </button>
              <button className="btn btn-primary btn-lg w-full" onClick={handleOrder}>
                <LuPackageCheck className='icon' />
                Order Now
              </button>
            </div>

            {/* Features */}
            <div className="detail-features">
              <div className="feature-item">
                <span>🚚</span>
                <span>Free Shipping</span>
              </div>
              <div className="feature-item">
                <span>↩️</span>
                <span>30-Day Returns</span>
              </div>
              <div className="feature-item">
                <span>🛡️</span>
                <span>Secure Payment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="detail-reviews">
          <h2>Customer Reviews</h2>
          <div className="reviews-grid">
            {reviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <span className="review-user">{review.user}</span>
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} style={{ color: i < review.rating ? '#ffc107' : '#444' }}>★</span>
                    ))}
                  </div>
                </div>
                <p className="review-comment">{review.comment}</p>
                <span className="review-date">{review.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="related-products">
            <h2>Related Products</h2>
            <div className="products-grid">
              {relatedProducts.map((prod, index) => (
                <Link
                  to={`/products/${getProductId(prod)}`}
                  key={getProductId(prod)}
                  className="product-card"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="product-image">
                    <img src={prod.images[0]} alt={prod.name} />
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{prod.name}</h3>
                    <div className="product-price">
                      <span className="price">₹{(prod.price * 83).toFixed(0)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
