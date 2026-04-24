import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import {
  authAPI,
  formatINR,
  getProductId,
  normalizeOrdersResponse,
  normalizeProductsResponse,
  ordersAPI,
  productsAPI
} from '../utils/api';
import './Admin.css';

function Admin() {
  const { user, showToast } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // New product form
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'Electronics',
    stock: '',
    images: [''],
    featured: false,
    sizes: [],
    colors: []
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersData, productsData, usersData] = await Promise.all([
        ordersAPI.getAll(),
        productsAPI.getAll(),
        authAPI.getUsers()
      ]);
      
      setOrders(normalizeOrdersResponse(ordersData));
      setProducts(normalizeProductsResponse(productsData));
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast(error.message || 'Unable to fetch admin data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await productsAPI.delete(productId);
      showToast('Product deleted successfully', 'success');
      fetchData();
    } catch (error) {
      showToast(error.message || 'Failed to delete product', 'error');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    
    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        originalPrice: parseFloat(productForm.originalPrice) || parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        images: productForm.images.filter(img => img.trim() !== '')
      };
      
      await productsAPI.create(productData);
      showToast('Product created successfully', 'success');
      setShowProductForm(false);
      setProductForm({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        category: 'Electronics',
        stock: '',
        images: [''],
        featured: false,
        sizes: [],
        colors: []
      });
      fetchData();
    } catch (error) {
      showToast(error.message || 'Failed to create product', 'error');
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await ordersAPI.updateStatus(orderId, status);
      showToast('Order status updated', 'success');
      fetchData();
    } catch (error) {
      showToast(error.message || 'Failed to update status', 'error');
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return '';
    }
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header animate-slide-down">
          <div className="header-content">
            <h1>Admin Dashboard</h1>
            <p>Manage your store</p>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="hamburger-icon">
              {mobileMenuOpen ? '✕' : '☰'}
            </span>
          </button>
        </div>

        <div className="admin-layout">
          {/* Sidebar */}
          <aside className={`admin-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
            <nav className="admin-nav">
              <button 
                className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('dashboard');
                  setMobileMenuOpen(false);
                }}
              >
                <span className="nav-icon">📊</span>
                <span className="nav-text">Dashboard</span>
              </button>
              <button 
                className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('orders');
                  setMobileMenuOpen(false);
                }}
              >
                <span className="nav-icon">📦</span>
                <span className="nav-text">Orders</span>
              </button>
              <button 
                className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('products');
                  setMobileMenuOpen(false);
                }}
              >
                <span className="nav-icon">🛍️</span>
                <span className="nav-text">Products</span>
              </button>
              <button 
                className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('users');
                  setMobileMenuOpen(false);
                }}
              >
                <span className="nav-icon">👥</span>
                <span className="nav-text">Users</span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="admin-main animate-fade-in">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="admin-section slide-in">
                <h2>Overview</h2>
                <div className="stats-grid">
                  <div className="stat-card animate-scale-in" style={{animationDelay: '0.1s'}}>
                    <span className="stat-icon">📦</span>
                    <div className="stat-info">
                      <span className="stat-number">{orders.length}</span>
                      <span className="stat-label">Total Orders</span>
                    </div>
                  </div>
                  <div className="stat-card animate-scale-in" style={{animationDelay: '0.2s'}}>
                    <span className="stat-icon">🛍️</span>
                    <div className="stat-info">
                      <span className="stat-number">{products.length}</span>
                      <span className="stat-label">Products</span>
                    </div>
                  </div>
                  <div className="stat-card animate-scale-in" style={{animationDelay: '0.3s'}}>
                    <span className="stat-icon">👥</span>
                    <div className="stat-info">
                      <span className="stat-number">{users.length}</span>
                      <span className="stat-label">Users</span>
                    </div>
                  </div>
                  <div className="stat-card animate-scale-in" style={{animationDelay: '0.4s'}}>
                    <span className="stat-icon">💰</span>
                    <div className="stat-info">
                      <span className="stat-number">{formatINR(orders.reduce((sum, o) => sum + o.total, 0))}</span>
                      <span className="stat-label">Total Revenue</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="admin-section slide-in">
                <h2>All Orders</h2>
                {loading ? (
                  <div className="flex-center loading-container">
                    <div className="spinner"></div>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="admin-table animate-fade-in">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Items</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order, index) => (
                          <tr key={order.id} className="animate-slide-in" style={{animationDelay: `${index * 0.05}s`}}>
                            <td>#{String(order.id).slice(0, 8)}</td>
                            <td>{order.shippingAddress?.fullName || order.user?.name || 'Customer'}</td>
                            <td>{order.items?.length || 0} items</td>
                            <td>{formatINR(order.total)}</td>
                            <td>
                              <span className={`status-badge ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </td>
                            <td>
                              <select 
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                className="status-select"
                              >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="admin-section slide-in">
                <div className="section-header">
                  <h2>All Products</h2>
                  <button 
                    className="btn btn-primary animate-pulse"
                    onClick={() => setShowProductForm(!showProductForm)}
                  >
                    {showProductForm ? 'Cancel' : '+ Add Product'}
                  </button>
                </div>

                {/* Product Form */}
                {showProductForm && (
                  <form onSubmit={handleCreateProduct} className="product-form animate-slide-down">
                    <div className="form-row">
                      <div className="input-group">
                        <label>Product Name</label>
                        <input
                          type="text"
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          required
                          className="input-field"
                          placeholder="Enter product name"
                        />
                      </div>
                      <div className="input-group">
                        <label>Category</label>
                        <select
                          value={productForm.category}
                          onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                          className="input-field"
                        >
                          <option>Electronics</option>
                          <option>Fashion</option>
                          <option>Beauty</option>
                          <option>Sports</option>
                          <option>Home & Garden</option>
                          <option>Books</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="input-group">
                      <label>Description</label>
                      <textarea
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        required
                        className="input-field"
                        rows="3"
                        placeholder="Enter product description"
                      />
                    </div>
                    
                    <div className="form-row">
                      <div className="input-group">
                        <label>Price ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          required
                          className="input-field"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="input-group">
                        <label>Original Price ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={productForm.originalPrice}
                          onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                          className="input-field"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="input-group">
                        <label>Stock</label>
                        <input
                          type="number"
                          min="0"
                          value={productForm.stock}
                          onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                          required
                          className="input-field"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    
                    <div className="input-group">
                      <label>Image URL</label>
                      <input
                        type="url"
                        value={productForm.images[0]}
                        onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })}
                        required
                        className="input-field"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    
                    <button type="submit" className="btn btn-primary btn-full">
                      Create Product
                    </button>
                  </form>
                )}

                {/* Products Table */}
                <div className="table-responsive">
                  <table className="admin-table animate-fade-in">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product, index) => (
                        <tr key={getProductId(product)} className="animate-slide-in" style={{animationDelay: `${index * 0.05}s`}}>
                          <td>
                            <div className="product-cell">
                              <img src={product.images?.[0] || 'https://via.placeholder.com/60'} alt={product.name} className="product-thumbnail" />
                              <span className="product-name">{product.name}</span>
                            </div>
                          </td>
                          <td>
                            <span className="category-badge">{product.category}</span>
                          </td>
                          <td>
                            <span className="price">{formatINR(product.price * 83)}</span>
                          </td>
                          <td>
                            <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="btn btn-sm btn-outline delete-btn"
                              onClick={() => handleDeleteProduct(getProductId(product))}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="admin-section slide-in">
                <h2>All Users</h2>
                <div className="table-responsive">
                  <table className="admin-table animate-fade-in">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u, index) => (
                        <tr key={u.id || u._id} className="animate-slide-in" style={{animationDelay: `${index * 0.05}s`}}>
                          <td>
                            <div className="user-cell">
                              <div className="user-avatar">
                                {u.name?.charAt(0).toUpperCase()}
                              </div>
                              <span>{u.name}</span>
                            </div>
                          </td>
                          <td>{u.email}</td>
                          <td>
                            <span className={`role-badge ${u.role}`}>
                              {u.role}
                            </span>
                          </td>
                          <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
