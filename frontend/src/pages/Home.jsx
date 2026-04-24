import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getCategorySlug,
  getProductId,
  normalizeCategoriesResponse,
  normalizeProductsResponse
} from '../utils/api';
import './Home.css';

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  const fetchWithTimeout = (url, options = {}, timeout = 5000) => {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), timeout)
      )
    ]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetchWithTimeout('/api/products/featured'),
          fetchWithTimeout('/api/products/categories')
        ]);

        if (!productsRes.ok || !categoriesRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const productsData = normalizeProductsResponse(await productsRes.json());
        const categoriesData = normalizeCategoriesResponse(await categoriesRes.json());

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Unable to load data. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate hero slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Fashion Blogger",
      content: "Amazing quality products! The customer service is exceptional and shipping was super fast. Highly recommend!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108777-466d9225d9e6?w=150"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Tech Enthusiast",
      content: "Best online shopping experience I've ever had. The product selection is incredible and prices are unbeatable.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
    },
    {
      id: 3,
      name: "Emma Davis",
      role: "Interior Designer",
      content: "I'm impressed by the quality and attention to detail. Will definitely be shopping here again!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150"
    }
  ];

  const heroSlides = [
    {
      title: "Summer Collection 2024",
      subtitle: "Discover the latest trends",
      cta: "Shop Summer",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800",
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      title: "Tech Gadgets Sale",
      subtitle: "Up to 50% off on electronics",
      cta: "Shop Tech",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800",
      color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      title: "Home Essentials",
      subtitle: "Make your home beautiful",
      cta: "Shop Home",
      image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800",
      color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader">
          <div className="loader-circle"></div>
          <div className="loader-text">Loading amazing products...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Carousel */}
      <section className="hero-carousel">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ background: slide.color }}
          >
            <div className="hero-overlay"></div>
            <div className="hero-content container">
              <div className="hero-text">
                <span className="hero-badge animate-fade-in">New Arrivals</span>
                <h1 className="hero-title animate-slide-up">{slide.title}</h1>
                <p className="hero-subtitle animate-slide-up delay-1">{slide.subtitle}</p>
                <div className="hero-actions animate-slide-up delay-2">
                  <Link to="/products" className="btn btn-primary btn-lg">
                    {slide.cta}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                  <Link to="/products?featured=true" className="btn btn-outline-light btn-lg">
                    View Featured
                  </Link>
                </div>
              </div>
              <div className="hero-image animate-zoom-in">
                <img src={slide.image} alt={slide.title} loading="lazy" />
              </div>
            </div>
          </div>
        ))}
        
        {/* Carousel Indicators */}
        <div className="carousel-indicators">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-subtitle">Shop by Category</span>
              <h2 className="section-title">Browse Our Collections</h2>
            </div>
            <Link to="/categories" className="view-all">
              View All Categories
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
          
          <div className="categories-grid">
            {categories.map((category, index) => (
              <Link 
                to={`/products?category=${getCategorySlug(category)}`} 
                key={category.id || category.name}
                className="category-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="category-image-wrapper">
                  <div className="category-image">
                    <img
                      src={category.image}
                      alt={category.name}
                      loading="lazy"
                    />
                    <div className="category-overlay">
                      <span className="category-link">Explore →</span>
                    </div>
                  </div>
                  <div className="category-info">
                    <h3 className="category-name">{category.name}</h3>
                    <span className="category-count">{category.productCount || 12} Products</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-subtitle">Featured Products</span>
              <h2 className="section-title">Our Bestsellers</h2>
              <p className="section-description">Hand-picked products that our customers love</p>
            </div>
            <Link to="/products?featured=true" className="view-all">
              Shop All
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
          
          <div className="products-grid">
            {products.slice(0, 8).map((product, index) => (
              <Link 
                to={`/products/${getProductId(product)}`} 
                key={getProductId(product)}
                className="product-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="product-image-wrapper">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="product-image"
                    loading="lazy"
                  />
                  {product.originalPrice > product.price && (
                    <span className="product-badge discount">
                      -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </span>
                  )}
                  {product.isNew && (
                    <span className="product-badge new">New</span>
                  )}
                  <div className="product-actions">
                    <button className="product-action-btn" onClick={(e) => {
                      e.preventDefault();
                      // Add to wishlist
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    </button>
                    <button className="product-action-btn" onClick={(e) => {
                      e.preventDefault();
                      // Quick view
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M22 12c-2.667 4.667-6 7-10 7s-7.333-2.333-10-7c2.667-4.667 6-7 10-7s7.333 2.333 10 7z"/>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <h3 className="product-name">{product.name}</h3>
                  
                  <div className="product-rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.floor(product.rating) ? 'star filled' : 'star'}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="rating-count">({product.reviews})</span>
                  </div>
                  
                  <div className="product-price">
                    <span className="current-price">{formatPrice(product.price)}</span>
                    {product.originalPrice > product.price && (
                      <span className="original-price">{formatPrice(product.originalPrice)}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="promo-banner">
        <div className="container">
          <div className="promo-content">
            <div className="promo-text">
              <span className="promo-badge">Limited Time Offer</span>
              <h2 className="promo-title">Summer Sale is Live!</h2>
              <p className="promo-description">Get up to 50% off on selected items. Don't miss out!</p>
              <div className="promo-timer">
                <div className="timer-block">
                  <span className="timer-number">02</span>
                  <span className="timer-label">Days</span>
                </div>
                <div className="timer-block">
                  <span className="timer-number">12</span>
                  <span className="timer-label">Hours</span>
                </div>
                <div className="timer-block">
                  <span className="timer-number">45</span>
                  <span className="timer-label">Mins</span>
                </div>
                <div className="timer-block">
                  <span className="timer-number">30</span>
                  <span className="timer-label">Secs</span>
                </div>
              </div>
              <Link to="/products?sale=true" className="btn btn-primary btn-lg">
                Shop the Sale
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
            <div className="promo-image">
              <img src="https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=500" alt="Sale" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
              <h3 className="feature-title">Free Shipping</h3>
              <p className="feature-description">On orders over $50</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <h3 className="feature-title">Secure Payment</h3>
              <p className="feature-description">100% secure checkout</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <h3 className="feature-title">24/7 Support</h3>
              <p className="feature-description">Dedicated support team</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 4v16h16"/>
                  <path d="m20 10-6-6-6 6-4-4"/>
                </svg>
              </div>
              <h3 className="feature-title">Best Prices</h3>
              <p className="feature-description">Price match guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">Testimonials</span>
            <h2 className="section-title">What Our Customers Say</h2>
          </div>
          
          <div className="testimonials-carousel">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`testimonial-card ${index === activeTestimonial ? 'active' : ''}`}
              >
                <div className="testimonial-rating">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="star filled">★</span>
                  ))}
                </div>
                <p className="testimonial-content">"{testimonial.content}"</p>
                <div className="testimonial-author">
                  <img src={testimonial.image} alt={testimonial.name} className="author-image" />
                  <div className="author-info">
                    <h4 className="author-name">{testimonial.name}</h4>
                    <span className="author-role">{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="testimonial-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === activeTestimonial ? 'active' : ''}`}
                  onClick={() => setActiveTestimonial(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-wrapper">
            <div className="newsletter-content">
              <h2 className="newsletter-title">Join Our Newsletter</h2>
              <p className="newsletter-description">
                Subscribe to get special offers, free giveaways, and exclusive deals.
              </p>
              <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                  <input 
                    type="email" 
                    placeholder="Enter your email address" 
                    className="newsletter-input"
                    required
                  />
                  <button type="submit" className="btn btn-primary newsletter-btn">
                    Subscribe
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                    </svg>
                  </button>
                </div>
                <p className="newsletter-note">
                  By subscribing, you agree to our Privacy Policy and consent to receive updates.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
