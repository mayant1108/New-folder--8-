import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import './Checkout.css';

function Checkout() {
  const { cart, getCartTotal, clearCart, user, showToast } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    paymentMethod: 'card'
  });

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        userId: user?.id || 'guest',
        items: cart.map(item => ({
          productId: item.productId,
          product: item.product,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: item.product.price
        })),
        total,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        paymentMethod: formData.paymentMethod
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        clearCart();
        showToast('Order placed successfully!', 'success');
        navigate('/dashboard');
      } else {
        throw new Error('Failed to place order');
      }
    } catch (error) {
      showToast('Failed to place order. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Add some items to your cart before checking out.</p>
            <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title">Checkout</h1>
        
        <form onSubmit={handleSubmit} className="checkout-layout">
          {/* Checkout Form */}
          <div className="checkout-form">
            {/* Shipping Information */}
            <div className="form-section">
              <h2>Shipping Information</h2>
              
              <div className="form-row">
                <div className="input-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
                <div className="input-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="input-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
                <div className="input-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
              </div>
              
              <div className="input-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
              
              <div className="form-row">
                <div className="input-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
                <div className="input-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
                <div className="input-group">
                  <label>ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
              </div>
              
              <div className="input-group">
                <label>Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                  <option>Germany</option>
                </select>
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="form-section">
              <h2>Payment Method</h2>
              
              <div className="payment-options">
                <label className={`payment-option ${formData.paymentMethod === 'card' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleChange}
                  />
                  <span className="payment-icon">💳</span>
                  <span className="payment-label">
                    <strong>Credit/Debit Card</strong>
                    <small>Visa, Mastercard, Amex</small>
                  </span>
                </label>
                
                <label className={`payment-option ${formData.paymentMethod === 'paypal' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === 'paypal'}
                    onChange={handleChange}
                  />
                  <span className="payment-icon">🅿️</span>
                  <span className="payment-label">
                    <strong>PayPal</strong>
                    <small>Pay with your PayPal account</small>
                  </span>
                </label>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="checkout-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-items">
              {cart.map(item => (
                <div key={item.id} className="summary-item">
                  <img src={item.product.images[0]} alt={item.product.name} />
                  <div className="summary-item-info">
                    <h4>{item.product.name}</h4>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            
            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
              {loading ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
            </button>
            
            <p className="secure-note">
              🔒 Your payment information is secure
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
