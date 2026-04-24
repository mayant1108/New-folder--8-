import { Routes, Route } from 'react-router-dom';
import { useState, useEffect, createContext, useContext, useRef } from 'react';
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
import { cartAPI, getProductId, normalizeCartResponse, normalizeUser } from './utils/api';

// Create Context
export const AppContext = createContext();

export const useApp = () => useContext(AppContext);

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const syncingGuestCartRef = useRef(false);

  useEffect(() => {
    // Load user and token from localStorage
    const savedUser = localStorage.getItem('shophub_user');
    const savedToken = localStorage.getItem('shophub_token');
    
    if (savedUser && savedToken) {
      setUser(normalizeUser(JSON.parse(savedUser)));
      setToken(savedToken);
    } else {
      // Guest cart only. Authenticated carts are loaded from backend.
      const savedCart = localStorage.getItem('shophub_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!token) {
      localStorage.setItem('shophub_cart', JSON.stringify(cart));
    }
    
    // Update cart count
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
  }, [cart, token]);

  useEffect(() => {
    // Save user and token to localStorage
    if (user && token) {
      localStorage.setItem('shophub_user', JSON.stringify(user));
      localStorage.setItem('shophub_token', token);
    } else {
      localStorage.removeItem('shophub_user');
      localStorage.removeItem('shophub_token');
    }
  }, [user, token]);

  useEffect(() => {
    if (!token || syncingGuestCartRef.current) {
      return;
    }

    let isMounted = true;

    const loadBackendCart = async () => {
      try {
        const backendCart = await cartAPI.getCart();
        if (isMounted) {
          setCart(normalizeCartResponse(backendCart));
        }
      } catch (error) {
        if (isMounted) {
          setCart([]);
          showToast('Unable to load your cart from backend', 'error');
        }
      }
    };

    loadBackendCart();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const refreshBackendCart = async () => {
    const backendCart = await cartAPI.getCart();
    const normalizedCart = normalizeCartResponse(backendCart);
    setCart(normalizedCart);
    return normalizedCart;
  };

  const syncGuestCartToBackend = async (guestCart) => {
    if (!guestCart.length) {
      return refreshBackendCart();
    }

    syncingGuestCartRef.current = true;

    try {
      for (const item of guestCart) {
        const productId = item.productId || getProductId(item.product);
        if (!productId) continue;

        await cartAPI.addItem({
          productId,
          quantity: item.quantity,
          size: item.size || '',
          color: item.color || ''
        });
      }

      localStorage.removeItem('shophub_cart');
      return await refreshBackendCart();
    } catch (error) {
      showToast('Cart sync failed. Please refresh and try again.', 'error');
      return [];
    } finally {
      syncingGuestCartRef.current = false;
    }
  };

  const addToCart = async (product, quantity = 1, size = null, color = null) => {
    const productId = getProductId(product);

    if (!productId) {
      showToast('Unable to add this product', 'error');
      return;
    }

    const cartItem = {
      id: `${productId}-${size || 'default'}-${color || 'default'}`,
      productId,
      product,
      quantity,
      size: size || '',
      color: color || ''
    };

    if (token) {
      try {
        const backendCart = await cartAPI.addItem({
          productId,
          quantity,
          size: size || '',
          color: color || ''
        });
        setCart(normalizeCartResponse(backendCart));
        showToast(`${product.name} added to cart!`, 'success');
      } catch (error) {
        showToast(error.message || 'Failed to add item to cart', 'error');
      }
      return;
    }

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

  const removeFromCart = async (itemId) => {
    const item = cart.find(cartItem => cartItem.id === itemId);

    if (token && item) {
      try {
        const backendCart = await cartAPI.removeItem(item.productId, item.size, item.color);
        setCart(normalizeCartResponse(backendCart));
        showToast('Item removed from cart', 'success');
      } catch (error) {
        showToast(error.message || 'Failed to remove item', 'error');
      }
      return;
    }

    setCart(prev => prev.filter(cartItem => cartItem.id !== itemId));
    showToast('Item removed from cart', 'success');
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    const item = cart.find(cartItem => cartItem.id === itemId);

    if (token && item) {
      try {
        const backendCart = await cartAPI.updateItem({
          productId: item.productId,
          quantity,
          size: item.size,
          color: item.color
        });
        setCart(normalizeCartResponse(backendCart));
      } catch (error) {
        showToast(error.message || 'Failed to update quantity', 'error');
      }
      return;
    }

    setCart(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = async () => {
    if (token) {
      try {
        await cartAPI.clearCart();
      } catch (error) {
        showToast(error.message || 'Failed to clear backend cart', 'error');
      }
    }

    setCart([]);
  };

  const login = (userData, authToken) => {
    const { token: embeddedToken, ...normalizedUser } = userData || {};
    const resolvedToken = authToken || embeddedToken || null;
    const normalizedAccount = normalizeUser(normalizedUser);
    const guestCart = [...cart];

    setUser(normalizedAccount);
    setToken(resolvedToken);

    if (normalizedAccount?.name) {
      showToast(`Welcome back, ${normalizedAccount.name}!`, 'success');
    }

    if (resolvedToken) {
      localStorage.setItem('shophub_user', JSON.stringify(normalizedAccount));
      localStorage.setItem('shophub_token', resolvedToken);
      syncGuestCartToBackend(guestCart);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setCart([]);
    localStorage.removeItem('shophub_user');
    localStorage.removeItem('shophub_token');
    localStorage.removeItem('shophub_cart');
    showToast('Logged out successfully', 'success');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = Number(item.product?.price ?? item.price ?? 0);
      return total + (price * item.quantity);
    }, 0);
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
      token,
      cart,
      cartCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      showToast
    }}>
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
    </AppContext.Provider>
  );
}

export default App;

