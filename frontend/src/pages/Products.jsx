import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './Products.css';

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.append('category', selectedCategory);
        if (priceRange.min) params.append('minPrice', priceRange.min);
        if (priceRange.max) params.append('maxPrice', priceRange.max);
        if (sortBy) params.append('sort', sortBy);
        if (searchQuery) params.append('search', searchQuery);

        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`/api/products?${params}`),
          fetch('/api/categories')
        ]);

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching products:', error);
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

  return (
    <div className="products-page">
      <div className="container">
        {/* Page Header */}
        <div className="products-header">
          <div>
            <h1 className="page-title">
              {searchQuery 
                ? `Search Results for "${searchQuery}"` 
                : selectedCategory 
                  ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)
                  : 'All Products'}
            </h1>
            <p className="page-subtitle">{products.length} products found</p>
          </div>
          <button 
            className="btn btn-secondary filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
              <line x1="10" y1="18" x2="14" y2="18"/>
            </svg>
            Filters
          </button>
        </div>

        <div className="products-layout">
          {/* Sidebar Filters */}
          <aside className={`products-sidebar ${showFilters ? 'show' : ''}`}>
            <div className="filter-section">
              <h3>Categories</h3>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === ''}
                    onChange={() => setSelectedCategory('')}
                  />
                  <span>All Categories</span>
                </label>
                {categories.map(cat => (
                  <label key={cat.id} className="filter-option">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat.name.toLowerCase()}
                      onChange={() => setSelectedCategory(cat.name.toLowerCase())}
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h3>Price Range</h3>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                />
              </div>
            </div>

            <button className="btn btn-outline w-full" onClick={clearFilters}>
              Clear All Filters
            </button>
          </aside>

          {/* Products Grid */}
          <div className="products-main">
            {/* Sort Bar */}
            <div className="products-sort">
              <span className="results-count">{products.length} products</span>
              <div className="sort-select">
                <label>Sort by:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="">Featured</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="popularity">Most Popular</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex-center" style={{ height: '40vh' }}>
                <div className="spinner"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="no-products">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search query</p>
                <button className="btn btn-primary" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {products.map((product, index) => (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
