import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect, createContext, useContext } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Toast from './components/Toast';

// Create Context
export const AppContext = createContext();

export const useApp = () => useContext(AppContext);

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage
    const savedUser = localStorage.getItem('shopzone_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('shopzone_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    // Save cart to localStorage
    localStorage.setItem('shopzone_cart', JSON.stringify(cart));
    
    // Update cart count
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
  }, [cart]);

  useEffect(() => {
    // Save user to localStorage
    if (user) {
      localStorage.setItem('shopzone_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('shopzone_user');
    }
  }, [user]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addToCart = async (product, quantity = 1, size = null, color = null) => {
    const cartItem = {
      id: `${product.id}-${size || 'default'}-${color || 'default'}`,
      productId: product.id,
      product,
      quantity,
      size,
      color
    };

    setCart(prev => {
      const existing = prev.find(item => item.id === cartItem.id);
      if (existing) {
        return prev.map(item => 
          item.id === cartItem.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, cartItem];
    });

    showToast(`${product.name} added to cart!`, 'success');
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
    showToast('Item removed from cart', 'success');
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const login = (userData) => {
    setUser(userData);
    showToast(`Welcome back, ${userData.name}!`, 'success');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('shopzone_user');
    showToast('Logged out successfully', 'success');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{
      user,
      setUser: login,
      logout,
      cart,
      cartCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      showToast
    }}>
      <Router>
        <div className="app">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
