import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import './Dashboard.css';

function Dashboard() {
  const { user, showToast } = useApp();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders', {
        headers: { 'user-id': user?.id }
      });
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>My Dashboard</h1>
          <p>Welcome back, {user.name}!</p>
        </div>

        <div className="dashboard-layout">
          {/* Sidebar */}
          <aside className="dashboard-sidebar">
            <div className="user-info">
              <div className="user-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
            
            <nav className="dashboard-nav">
              <a href="#orders" className="active">
                <span>📦</span> My Orders
              </a>
              <a href="#profile">
                <span>👤</span> Profile
              </a>
              <a href="#addresses">
                <span>📍</span> Addresses
              </a>
              <a href="#wishlist">
                <span>❤️</span> Wishlist
              </a>
              <a href="#settings">
                <span>⚙️</span> Settings
              </a>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="dashboard-main">
            {/* Stats */}
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-icon">📦</span>
                <div className="stat-info">
                  <span className="stat-number">{orders.length}</span>
                  <span className="stat-label">Total Orders</span>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">⏳</span>
                <div className="stat-info">
                  <span className="stat-number">{orders.filter(o => o.status === 'pending').length}</span>
                  <span className="stat-label">Pending</span>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">✅</span>
                <div className="stat-info">
                  <span className="stat-number">{orders.filter(o => o.status === 'delivered').length}</span>
                  <span className="stat-label">Delivered</span>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">💰</span>
                <div className="stat-info">
                  <span className="stat-number">${orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}</span>
                  <span className="stat-label">Total Spent</span>
                </div>
              </div>
            </div>

            {/* Orders Section */}
            <div className="dashboard-section" id="orders">
              <h2>My Orders</h2>
              
              {loading ? (
                <div className="flex-center" style={{ padding: '40px' }}>
                  <div className="spinner"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">📦</span>
                  <h3>No orders yet</h3>
                  <p>Start shopping to see your orders here</p>
                  <Link to="/products" className="btn btn-primary">
                    Shop Now
                  </Link>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <div className="order-id">
                          <span>Order #{order.id.slice(0, 8)}</span>
                          <span className="order-date">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <span className={`status-badge ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="order-items">
                        {order.items.slice(0, 3).map((item, index) => (
                          <img 
                            key={index}
                            src={item.product?.images?.[0] || 'https://via.placeholder.com/60'} 
                            alt={item.product?.name || 'Product'}
                          />
                        ))}
                        {order.items.length > 3 && (
                          <span className="more-items">+{order.items.length - 3}</span>
                        )}
                      </div>
                      
                      <div className="order-footer">
                        <span className="order-total">${order.total.toFixed(2)}</span>
                        <button className="btn btn-sm btn-outline">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
