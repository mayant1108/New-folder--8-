import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products?featured=true'),
          fetch('/api/categories')
        ]);
        
        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '60vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-content container">
          <span className="hero-badge">🎉 New Collection 2024</span>
          <h1 className="hero-title">
            Discover Your <span className="text-gradient">Perfect Style</span>
          </h1>
          <p className="hero-subtitle">
            Explore thousands of premium products with unbeatable prices. 
            Shop now and experience the future of online shopping.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary btn-lg">
              Shop Now
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link to="/products?featured=true" className="btn btn-outline btn-lg">
              View Featured
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Products</span>
            </div>
            <div className="stat">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Customers</span>
            </div>
            <div className="stat">
              <span className="stat-number">4.9★</span>
              <span className="stat-label">Rating</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card hero-card-1">
            <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300" alt="Headphones" />
          </div>
          <div className="hero-card hero-card-2">
            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300" alt="Shoes" />
          </div>
          <div className="hero-card hero-card-3">
            <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300" alt="Watch" />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <Link 
                to={`/products?category=${category.name.toLowerCase()}`} 
                key={category.id}
                className="category-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="category-image">
                  <img src={category.image} alt={category.name} />
                </div>
                <span className="category-name">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <Link to="/products?featured=true" className="view-all">
              View All
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
          <div className="products-grid">
            {products.slice(0, 8).map((product, index) => (
              <Link 
                to={`/products/${product.id}`} 
                key={product.id}
                className="product-card"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="product-image">
                  <img src={product.images[0]} alt={product.name} />
                  {product.originalPrice > product.price && (
                    <span className="product-badge">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </span>
                  )}
                  <div className="product-overlay">
                    <span className="quick-view">Quick View</span>
                  </div>
                </div>
                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-rating">
                    <span className="stars">★</span>
                    <span>{product.rating}</span>
                    <span className="reviews">({product.reviews})</span>
                  </div>
                  <div className="product-price">
                    <span className="price">${product.price.toFixed(2)}</span>
                    {product.originalPrice > product.price && (
                      <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">🚚</div>
              <h3>Free Shipping</h3>
              <p>On orders over $50</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🛡️</div>
              <h3>Secure Payment</h3>
              <p>100% secure checkout</p>
            </div>
            <div className="feature">
              <div className="feature-icon">↩️</div>
              <h3>Easy Returns</h3>
              <p>30-day return policy</p>
            </div>
            <div className="feature">
              <div className="feature-icon">💬</div>
              <h3>24/7 Support</h3>
              <p>Dedicated support team</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2>Subscribe to Our Newsletter</h2>
            <p>Get the latest updates on new products and upcoming sales</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
