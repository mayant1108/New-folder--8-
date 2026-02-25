import { Link } from 'react-router-dom';
import { useApp } from '../App';
import './Cart.css';

function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useApp();

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <Link to="/products" className="btn btn-primary btn-lg">
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
        <h1 className="page-title">Shopping Cart</h1>
        
        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            <div className="cart-header">
              <span>Product</span>
              <span>Quantity</span>
              <span>Total</span>
            </div>
            
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-product">
                  <img src={item.product.images[0]} alt={item.product.name} />
                  <div className="item-details">
                    <h3>{item.product.name}</h3>
                    <p className="item-variant">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </p>
                    <span className="item-price">${item.product.price.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="item-quantity">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                
                <div className="item-total">
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
            
            <div className="cart-actions">
              <Link to="/products" className="btn btn-secondary">
                Continue Shopping
              </Link>
              <button className="btn btn-outline" onClick={clearCart}>
                Clear Cart
              </button>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="cart-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="free-shipping">FREE</span> : `$${shipping.toFixed(2)}`}</span>
            </div>
            
            {shipping > 0 && (
              <p className="shipping-note">
                Add ${(50 - subtotal).toFixed(2)} more for free shipping!
              </p>
            )}
            
            <div className="summary-divider"></div>
            
            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            
            <Link to="/checkout" className="btn btn-primary btn-lg w-full">
              Proceed to Checkout
            </Link>
            
            <div className="summary-features">
              <div className="feature">
                <span>🛡️</span>
                <span>Secure Checkout</span>
              </div>
              <div className="feature">
                <span>↩️</span>
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
