import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useApp } from '../App';
import { formatINR } from '../utils/api';
import './Cart.css';

function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useApp();
  const [isUpdating, setIsUpdating] = useState(false);
  const [removingItemId, setRemovingItemId] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const exchangeRate = 83;
  const subtotal = getCartTotal() * exchangeRate;
  const shipping = subtotal > 4150 ? 0 : 250;
  const total = subtotal + shipping;
  const freeShippingProgress = Math.min((subtotal / 4150) * 100, 100);
  const getProductPrice = (item) => Number(item.product?.price ?? item.price ?? 0);
  const getProductName = (item) => item.product?.name || 'Product';
  const getProductImage = (item) => item.product?.images?.[0] || 'https://via.placeholder.com/120';

  const handleUpdateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    setIsUpdating(true);
    await updateQuantity(id, newQuantity);
    setTimeout(() => setIsUpdating(false), 300);
  };

  const handleRemoveItem = async (id) => {
    setRemovingItemId(id);
    setTimeout(async () => {
      await removeFromCart(id);
      setRemovingItemId(null);
    }, 300);
  };

  const handleClearCart = async () => {
    setShowClearConfirm(false);
    await clearCart();
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart animate-fade-in">
            <div className="empty-cart-icon animate-bounce">🛒</div>
            <h2 className="animate-slide-down">Your Cart is Empty</h2>
            <p className="animate-slide-down" style={{ animationDelay: '0.1s' }}>
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link 
              to="/products" 
              className="btn btn-primary btn-lg animate-pulse"
              style={{ animationDelay: '0.2s' }}
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title animate-slide-down">
          Shopping Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})
        </h1>
        
        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items animate-slide-in">
            <div className="cart-header">
              <span>Product</span>
              <span>Quantity</span>
              <span>Total</span>
            </div>
            
            {cart.map((item, index) => (
              <div 
                key={item.id} 
                className={`cart-item animate-slide-in ${removingItemId === item.id ? 'removing' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="item-product">
                  <div className="product-image-wrapper">
                    <img 
                      src={getProductImage(item)} 
                      alt={getProductName(item)}
                      loading="lazy"
                    />
                  </div>
                  <div className="item-details">
                    <h3>{getProductName(item)}</h3>
                    <p className="item-variant">
                      {item.size && (
                        <span className="variant-badge">
                          <span className="variant-label">Size:</span> {item.size}
                        </span>
                      )}
                      {item.color && (
                        <span className="variant-badge">
                          <span className="variant-label">Color:</span> 
                          <span className="color-dot" style={{ backgroundColor: item.color.toLowerCase() }}></span>
                          {item.color}
                        </span>
                      )}
                    </p>
                    <span className="item-price">{formatINR(getProductPrice(item) * exchangeRate)}</span>
                  </div>
                </div>
                
                <div className="item-quantity">
                  <button 
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={isUpdating || item.quantity <= 1}
                    className="quantity-btn"
                  >
                    −
                  </button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button 
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    disabled={isUpdating}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
                
                <div className="item-total">
                  <span className="total-price">
                    {formatINR(getProductPrice(item) * item.quantity * exchangeRate)}
                  </span>
                  <button 
                    className="remove-btn"
                    onClick={() => handleRemoveItem(item.id)}
                    aria-label="Remove item"
                  >
                    <span className="remove-icon">×</span>
                  </button>
                </div>
              </div>
            ))}
            
            <div className="cart-actions">
              <Link to="/products" className="btn btn-secondary">
                ← Continue Shopping
              </Link>
              <button 
                className="btn btn-outline clear-cart-btn"
                onClick={() => setShowClearConfirm(true)}
              >
                Clear Cart
              </button>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="cart-summary animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <h2>Order Summary</h2>
            
            {/* Free Shipping Progress */}
            {shipping > 0 && (
              <div className="shipping-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${freeShippingProgress}%` }}
                  ></div>
                </div>
                <p className="shipping-note animate-pulse">
                  🚚 Add {formatINR(4150 - subtotal)} more for free shipping!
                </p>
              </div>
            )}
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span className="summary-value">{formatINR(subtotal)}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping</span>
              <span className="summary-value">
                {shipping === 0 ? (
                  <span className="free-shipping-badge">FREE</span>
                ) : (
                  formatINR(shipping)
                )}
              </span>
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="summary-row total">
              <span>Total</span>
              <span className="total-amount">{formatINR(total)}</span>
            </div>
            
            <Link 
              to="/checkout" 
              className="btn btn-primary btn-lg w-full checkout-btn"
            >
              Proceed to Checkout
            </Link>
            
            <div className="summary-features">
              <div className="feature">
                <span className="feature-icon">🛡️</span>
                <span>Secure Checkout</span>
              </div>
              <div className="feature">
                <span className="feature-icon">↩️</span>
                <span>Easy Returns</span>
              </div>
              <div className="feature">
                <span className="feature-icon">⚡</span>
                <span>Fast Delivery</span>
              </div>
            </div>

            {/* Accepted Payment Methods */}
            <div className="payment-methods">
              <span className="payment-icon">💳</span>
              <span className="payment-icon">📱</span>
              <span className="payment-icon">🏦</span>
              <span className="payment-icon">💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Cart Confirmation Modal */}
      {showClearConfirm && (
        <div className="modal-overlay animate-fade-in" onClick={() => setShowClearConfirm(false)}>
          <div className="modal-content animate-scale-in" onClick={e => e.stopPropagation()}>
            <h3>Clear Cart?</h3>
            <p>Are you sure you want to remove all items from your cart?</p>
            <div className="modal-actions">
              <button 
                className="btn btn-outline"
                onClick={() => setShowClearConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleClearCart}
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
