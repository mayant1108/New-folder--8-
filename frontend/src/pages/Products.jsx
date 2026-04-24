import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  getCategorySlug,
  getProductId,
  normalizeCategoriesResponse,
  normalizeProductsResponse
} from '../utils/api';
import './Products.css';

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const selectedCategoryLabel =
    categories.find((category) => getCategorySlug(category) === selectedCategory)?.name || '';

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (selectedCategory) count++;
    if (priceRange.min || priceRange.max) count++;
    if (sortBy) count++;
    if (searchQuery) count++;
    setActiveFiltersCount(count);
  }, [selectedCategory, priceRange, sortBy, searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.append('category', selectedCategory);
        if (priceRange.min) params.append('minPrice', priceRange.min);
        if (priceRange.max) params.append('maxPrice', priceRange.max);
        if (sortBy) params.append('sort', sortBy);
        if (searchQuery) params.append('search', searchQuery);

        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`/api/products?${params}`),
          fetch('/api/products/categories')
        ]);

        if (!productsRes.ok || !categoriesRes.ok) {
          throw new Error('Failed to fetch products');
        }

        const productsData = normalizeProductsResponse(await productsRes.json());
        const categoriesData = normalizeCategoriesResponse(await categoriesRes.json());

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Unable to load products right now. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, priceRange, sortBy, searchQuery]);

  const clearFilters = () => {
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
    setSortBy('');
    setSearchQuery('');
    setSearchParams({});
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price * 83);
  };

  return (
    <div className="products-page">
      {/* Hero Section */}
      <div className="products-hero">
        <div className="container">
          <h1 className="hero-title">Our Products</h1>
          <p className="hero-subtitle">Discover amazing products at the best prices</p>
          
          {/* Search Bar */}
          <div className="hero-search">
            <div className="search-wrapper">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button className="clear-search" onClick={() => setSearchQuery('')}>
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Page Header */}
        <div className="products-header">
          <div className="header-left">
            <h2 className="page-title">
              {searchQuery ? (
                <>Search Results for "<span className="highlight">{searchQuery}</span>"</>
              ) : selectedCategory ? (
                selectedCategoryLabel || selectedCategory
              ) : (
                'All Products'
              )}
            </h2>
            <p className="product-count">
              <span className="count-number">{products.length}</span> products found
              {activeFiltersCount > 0 && (
                <span className="active-filters-badge">
                  {activeFiltersCount} active filter{activeFiltersCount > 1 ? 's' : ''}
                </span>
              )}
            </p>
          </div>
          
          <div className="header-actions">
            {activeFiltersCount > 0 && (
              <button className="btn btn-link" onClick={clearFilters}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                Clear all
              </button>
            )}
            
            <button 
              className={`btn filter-toggle ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="4" y1="6" x2="20" y2="6"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
                <line x1="10" y1="18" x2="14" y2="18"/>
              </svg>
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="filter-badge">{activeFiltersCount}</span>
              )}
            </button>
          </div>
        </div>

        <div className="products-layout">
          {/* Sidebar Filters */}
          <aside className={`products-sidebar ${showFilters ? 'show' : ''}`}>
            <div className="sidebar-header">
              <h3>Filter Products</h3>
              <button className="close-sidebar" onClick={() => setShowFilters(false)}>
                ×
              </button>
            </div>

            <div className="filter-section">
              <h4 className="filter-title">Categories</h4>
              <div className="filter-options">
                <label className={`filter-option ${selectedCategory === '' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === ''}
                    onChange={() => setSelectedCategory('')}
                  />
                  <span className="option-text">All Categories</span>
                  <span className="option-count">{categories.length}</span>
                </label>
                {categories.map(cat => (
                  <label
                    key={cat.id || cat.name}
                    className={`filter-option ${selectedCategory === getCategorySlug(cat) ? 'active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === getCategorySlug(cat)}
                      onChange={() => setSelectedCategory(getCategorySlug(cat))}
                    />
                    <span className="option-text">{cat.name}</span>
                    <span className="option-count">({cat.productCount || 0})</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4 className="filter-title">Price Range</h4>
              <div className="price-inputs">
                <div className="input-group">
                  <span className="currency">₹</span>
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  />
                </div>
                <span className="range-separator">to</span>
                <div className="input-group">
                  <span className="currency">₹</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button className="btn btn-primary w-full" onClick={clearFilters}>
              Apply Filters
            </button>
          </aside>

          {/* Products Grid */}
          <div className="products-main">
            {/* Sort Bar */}
            <div className="sort-bar">
              <div className="results-info">
                <span className="results-count">Showing <strong>{products.length}</strong> products</span>
                {activeFiltersCount > 0 && (
                  <button className="btn btn-link-mobile" onClick={clearFilters}>
                    Clear filters
                  </button>
                )}
              </div>
              
              <div className="sort-select">
                <label htmlFor="sort">Sort by:</label>
                <select 
                  id="sort"
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="select-custom"
                >
                  <option value="">Featured</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="popularity">Most Popular</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading amazing products...</p>
              </div>
            ) : error ? (
              <div className="empty-state">
                <h3>Something went wrong</h3>
                <p>{error}</p>
                <button className="btn btn-primary" onClick={() => window.location.reload()}>
                  Try Again
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-illustration">
                  <svg viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="40" r="20" stroke="currentColor" strokeWidth="2"/>
                    <path d="M30 70 L70 70" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="35" cy="35" r="3" fill="currentColor"/>
                    <circle cx="65" cy="35" r="3" fill="currentColor"/>
                  </svg>
                </div>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search query</p>
                <button className="btn btn-primary" onClick={clearFilters}>
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {products.map((product, index) => (
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
                          {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                        </span>
                      )}
                      {product.stock < 10 && product.stock > 0 && (
                        <span className="product-badge low-stock">
                          Only {product.stock} left
                        </span>
                      )}
                      {product.stock === 0 && (
                        <span className="product-badge out-of-stock">
                          Out of Stock
                        </span>
                      )}
                    </div>
                    
                    <div className="product-info">
                      <div className="product-category">{product.category}</div>
                      <h3 className="product-name">{product.name}</h3>
                      
                      <div className="product-rating">
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < Math.floor(product.rating) ? 'star filled' : 'star'}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="rating-value">{product.rating}</span>
                        <span className="reviews-count">({product.reviews} reviews)</span>
                      </div>
                      
                      <div className="product-price-section">
                        <div className="product-price">
                          <span className="current-price">{formatPrice(product.price)}</span>
                          {product.originalPrice > product.price && (
                            <span className="original-price">{formatPrice(product.originalPrice)}</span>
                          )}
                        </div>
                        
                        <button className="quick-view-btn" aria-label="Quick view">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="3"/>
                            <path d="M22 12c-2.667 4.667-6 7-10 7s-7.333-2.333-10-7c2.667-4.667 6-7 10-7s7.333 2.333 10 7z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
