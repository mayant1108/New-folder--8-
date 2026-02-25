import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import './Admin.css';

function Admin() {
  const { user, showToast } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
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
      const [ordersRes, productsRes, usersRes] = await Promise.all([
        fetch('/api/admin/orders'),
        fetch('/api/products'),
        fetch('/api/admin/users')
      ]);
      
      setOrders(await ordersRes.json());
      setProducts(await productsRes.json());
      setUsers(await usersRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        showToast('Product deleted successfully', 'success');
        fetchData();
      }
    } catch (error) {
      showToast('Failed to delete product', 'error');
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
      
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      
      if (response.ok) {
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
      }
    } catch (error) {
      showToast('Failed to create product', 'error');
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        showToast('Order status updated', 'success');
        fetchData();
      }
    } catch (error) {
      showToast('Failed to update status', 'error');
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
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Manage your store</p>
        </div>

        <div className="admin-layout">
          {/* Sidebar */}
          <aside className="admin-sidebar">
            <nav className="admin-nav">
              <button 
                className={activeTab === 'dashboard' ? 'active' : ''}
                onClick={() => setActiveTab('dashboard')}
              >
                <span>📊</span> Dashboard
              </button>
              <button 
                className={activeTab === 'orders' ? 'active' : ''}
                onClick={() => setActiveTab('orders')}
              >
                <span>📦</span> Orders
              </button>
              <button 
                className={activeTab === 'products' ? 'active' : ''}
                onClick={() => setActiveTab('products')}
              >
                <span>🛍️</span> Products
              </button>
              <button 
                className={activeTab === 'users' ? 'active' : ''}
                onClick={() => setActiveTab('users')}
              >
                <span>👥</span> Users
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="admin-main">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="admin-section">
                <h2>Overview</h2>
                <div className="stats-grid">
                  <div className="stat-card">
                    <span className="stat-icon">📦</span>
                    <div className="stat-info">
                      <span className="stat-number">{orders.length}</span>
                      <span className="stat-label">Total Orders</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <span className="stat-icon">🛍️</span>
                    <div className="stat-info">
                      <span className="stat-number">{products.length}</span>
                      <span className="stat-label">Products</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <span className="stat-icon">👥</span>
                    <div className="stat-info">
                      <span className="stat-number">{users.length}</span>
                      <span className="stat-label">Users</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <span className="stat-icon">💰</span>
                    <div className="stat-info">
                      <span className="stat-number">${orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}</span>
                      <span className="stat-label">Total Revenue</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="admin-section">
                <h2>All Orders</h2>
                {loading ? (
                  <div className="flex-center" style={{ padding: '40px' }}>
                    <div className="spinner"></div>
                  </div>
                ) : (
                  <div className="admin-table">
                    <table>
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
                        {orders.map(order => (
                          <tr key={order.id}>
                            <td>#{order.id.slice(0, 8)}</td>
                            <td>{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</td>
                            <td>{order.items?.length || 0} items</td>
                            <td>${order.total?.toFixed(2)}</td>
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
              <div className="admin-section">
                <div className="section-header">
                  <h2>All Products</h2>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowProductForm(!showProductForm)}
                  >
                    {showProductForm ? 'Cancel' : '+ Add Product'}
                  </button>
                </div>

                {/* Product Form */}
                {showProductForm && (
                  <form onSubmit={handleCreateProduct} className="product-form">
                    <div className="form-row">
                      <div className="input-group">
                        <label>Product Name</label>
                        <input
                          type="text"
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          required
                          className="input-field"
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
                      />
                    </div>
                    
                    <div className="form-row">
                      <div className="input-group">
                        <label>Price</label>
                        <input
                          type="number"
                          step="0.01"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          required
                          className="input-field"
                        />
                      </div>
                      <div className="input-group">
                        <label>Original Price</label>
                        <input
                          type="number"
                          step="0.01"
                          value={productForm.originalPrice}
                          onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                          className="input-field"
                        />
                      </div>
                      <div className="input-group">
                        <label>Stock</label>
                        <input
                          type="number"
                          value={productForm.stock}
                          onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                          required
                          className="input-field"
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
                    
                    <button type="submit" className="btn btn-primary">
                      Create Product
                    </button>
                  </form>
                )}

                {/* Products Table */}
                <div className="admin-table">
                  <table>
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
                      {products.map(product => (
                        <tr key={product.id}>
                          <td>
                            <div className="product-cell">
                              <img src={product.images[0]} alt={product.name} />
                              <span>{product.name}</span>
                            </div>
                          </td>
                          <td>{product.category}</td>
                          <td>${product.price.toFixed(2)}</td>
                          <td>{product.stock}</td>
                          <td>
                            <button 
                              className="btn btn-sm btn-outline"
                              onClick={() => handleDeleteProduct(product.id)}
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
              <div className="admin-section">
                <h2>All Users</h2>
                <div className="admin-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id}>
                          <td>{u.name}</td>
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
