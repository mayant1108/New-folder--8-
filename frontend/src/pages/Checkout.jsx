import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { formatINR, getProductId, ordersAPI } from '../utils/api';
import './Checkout.css';
import './CheckoutExtra.css';

function Checkout() {
  const { cart, getCartTotal, clearCart, user, showToast } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [qrScanProgress, setQrScanProgress] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: user?.email || '', phone: '',
    address: '', city: '', state: '', zipCode: '', country: 'India',
    paymentMethod: 'cod', upiId: '', cardNumber: '', cardName: '', expiry: '', cvv: ''
  });

  const exchangeRate = 83;
  const subtotal = getCartTotal() * exchangeRate;
  const shipping = subtotal > 4150 ? 0 : 250;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;
  const getCartItemPrice = (item) => Number(item.product?.price ?? item.price ?? 0);
  const getCartItemName = (item) => item.product?.name || 'Product';
  const getCartItemImage = (item) => item.product?.images?.[0] || 'https://via.placeholder.com/80';

  useEffect(() => {
    if (!user) {
      showToast('Please login before checkout', 'error');
      navigate('/login');
    }
  }, [user, navigate, showToast]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep1 = () => {
    if (!formData.firstName || !formData.lastName || !formData.email ||
        !formData.phone || !formData.address || !formData.city ||
        !formData.state || !formData.zipCode) {
      showToast('Please fill all shipping details', 'error');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (formStep === 1 && validateStep1()) {
      setFormStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setFormStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }

    if (!validateStep1()) return;

    setLoading(true);

    try {
      const backendPaymentMethod =
        formData.paymentMethod === 'cod'
          ? 'cod'
          : formData.paymentMethod === 'card'
            ? 'credit_card'
            : 'upi';

      const orderData = {
        orderItems: cart.map(item => ({
          product: item.productId || getProductId(item.product),
          name: item.product?.name || 'Product',
          image: item.product?.images?.[0] || '',
          quantity: item.quantity,
          size: item.size || '',
          color: item.color || '',
          price: getCartItemPrice(item) * exchangeRate
        })),
        itemsPrice: subtotal,
        shippingPrice: shipping,
        taxPrice: tax,
        totalPrice: total,
        shippingAddress: {
          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        paymentMethod: backendPaymentMethod,
        paymentNote: formData.paymentMethod === 'cod'
          ? `Cash on Delivery - Pay ${formatINR(total)} on delivery`
          : `Paid online - ${formatINR(total)}`
      };

      await ordersAPI.create(orderData);
      await clearCart();

      if (formData.paymentMethod === 'cod') {
        showToast(`Order placed! Pay ${formatINR(total)} on delivery`, 'success');
      } else {
        showToast('Payment successful! Order placed!', 'success');
      }
      navigate('/dashboard');
    } catch (error) {
      showToast('Failed to place order. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  if (paymentSuccess) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="payment-success animate-scale-in">
            <div className="success-icon animate-bounce">🎉</div>
            <h2 className="animate-slide-down">Payment Successful!</h2>
            <p className="animate-slide-down" style={{ animationDelay: '0.1s' }}>
              Thank you for your order. Your payment of <strong>₹{total.toFixed(0)}</strong> has been received.
            </p>
            <div className="order-number animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <span>Order #</span>
              <strong>ORD-{Date.now().toString().slice(-8)}</strong>
            </div>
            <p className="redirect-note animate-pulse" style={{ animationDelay: '0.5s' }}>
              Redirecting to dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="empty-cart animate-fade-in">
            <div className="empty-cart-icon animate-bounce">🛒</div>
            <h2 className="animate-slide-down">Your cart is empty</h2>
            <p className="animate-slide-down" style={{ animationDelay: '0.1s' }}>
              Add some items to your cart before checking out.
            </p>
            <Link 
              to="/products" 
              className="btn btn-primary btn-lg animate-pulse"
              style={{ animationDelay: '0.2s' }}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title animate-slide-down">Checkout</h1>

        {/* Checkout Steps */}
        <div className="checkout-steps animate-fade-in">
          <div className={`step ${formStep >= 1 ? 'active' : ''} ${formStep > 1 ? 'completed' : ''}`}>
            <span className="step-number">{formStep > 1 ? '✓' : '1'}</span>
            <span className="step-label">Shipping</span>
          </div>
          <div className={`step-line ${formStep > 1 ? 'active' : ''}`}></div>
          <div className={`step ${formStep >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Payment</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="checkout-layout">
          <div className="checkout-form animate-slide-in">
            {/* Step 1: Shipping Information */}
            {formStep === 1 && (
              <div className="form-section slide-in">
                <h2>
                  <span className="section-icon">📍</span>
                  Shipping Information
                </h2>

                <div className="form-row">
                  <div className="input-group">
                    <label>
                      First Name <span className="required">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="firstName" 
                      value={formData.firstName} 
                      onChange={handleChange} 
                      required 
                      className="input-field"
                      placeholder="John"
                    />
                  </div>
                  <div className="input-group">
                    <label>
                      Last Name <span className="required">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="lastName" 
                      value={formData.lastName} 
                      onChange={handleChange} 
                      required 
                      className="input-field"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="input-group">
                    <label>
                      Email <span className="required">*</span>
                    </label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      required 
                      className="input-field"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="input-group">
                    <label>
                      Phone <span className="required">*</span>
                    </label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      required 
                      className="input-field"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>
                    Address <span className="required">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange} 
                    required 
                    className="input-field"
                    placeholder="Street address, apartment, etc."
                  />
                </div>

                <div className="form-row">
                  <div className="input-group">
                    <label>
                      City <span className="required">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="city" 
                      value={formData.city} 
                      onChange={handleChange} 
                      required 
                      className="input-field"
                      placeholder="Mumbai"
                    />
                  </div>
                  <div className="input-group">
                    <label>
                      State <span className="required">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="state" 
                      value={formData.state} 
                      onChange={handleChange} 
                      required 
                      className="input-field"
                      placeholder="Maharashtra"
                    />
                  </div>
                  <div className="input-group">
                    <label>
                      PIN Code <span className="required">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="zipCode" 
                      value={formData.zipCode} 
                      onChange={handleChange} 
                      required 
                      className="input-field"
                      placeholder="400001"
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
                    <option value="India">India</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="Sri Lanka">Sri Lanka</option>
                    <option value="Nepal">Nepal</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>

                <button 
                  type="button" 
                  className="btn btn-primary btn-lg w-full next-btn"
                  onClick={handleNextStep}
                >
                  Continue to Payment
                  <span className="btn-icon">→</span>
                </button>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {formStep === 2 && (
              <div className="form-section slide-in">
                <h2>
                  <span className="section-icon">💳</span>
                  Payment Method
                </h2>

                <div className="payment-options">
                  <label className={`payment-option ${formData.paymentMethod === 'cod' ? 'active' : ''}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="cod" 
                      checked={formData.paymentMethod === 'cod'} 
                      onChange={handleChange} 
                    />
                    <span className="payment-icon">💵</span>
                    <span className="payment-label">
                      <strong>Cash on Delivery</strong>
                      <small>Pay when you receive</small>
                    </span>
                    <span className="payment-badge">Popular</span>
                  </label>

                  <label className={`payment-option ${formData.paymentMethod === 'phonepe' ? 'active' : ''}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="phonepe" 
                      checked={formData.paymentMethod === 'phonepe'} 
                      onChange={handleChange} 
                    />
                    <span className="payment-icon">📱</span>
                    <span className="payment-label">
                      <strong>PhonePe / UPI</strong>
                      <small>Pay instantly via UPI</small>
                    </span>
                    <span className="payment-badge">Fast</span>
                  </label>

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
                      <small>Visa, MasterCard, RuPay</small>
                    </span>
                  </label>
                </div>

                {/* COD Info */}
                {formData.paymentMethod === 'cod' && (
                  <div className="payment-info animate-slide-down">
                    <div className="info-icon">✅</div>
                    <div className="info-content">
                      <h4>Cash on Delivery</h4>
                      <p>No online payment required. Pay <strong>₹{total.toFixed(0)}</strong> in cash when your order is delivered.</p>
                    </div>
                  </div>
                )}

                {/* UPI Info */}
                {formData.paymentMethod === 'phonepe' && (
                  <div className="payment-info animate-slide-down">
                    <div className="info-icon">📱</div>
                    <div className="info-content">
                      <h4>UPI Payment</h4>
                      <p>Pay <strong>₹{total.toFixed(0)}</strong> instantly via any UPI app</p>
                      <div className="upi-input">
                        <input
                          type="text"
                          name="upiId"
                          placeholder="Enter your UPI ID (e.g., name@okhdfcbank)"
                          value={formData.upiId}
                          onChange={handleChange}
                          className="input-field"
                        />
                        <img src="/api/placeholder/80/40" alt="UPI" className="upi-logo" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Card Info */}
                {formData.paymentMethod === 'card' && (
                  <div className="payment-info animate-slide-down">
                    <div className="info-icon">💳</div>
                    <div className="info-content">
                      <h4>Card Payment</h4>
                      <div className="card-form">
                        <input
                          type="text"
                          name="cardNumber"
                          placeholder="Card Number"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          className="input-field"
                        />
                        <input
                          type="text"
                          name="cardName"
                          placeholder="Name on Card"
                          value={formData.cardName}
                          onChange={handleChange}
                          className="input-field"
                        />
                        <div className="card-row">
                          <input
                            type="text"
                            name="expiry"
                            placeholder="MM/YY"
                            value={formData.expiry}
                            onChange={handleChange}
                            className="input-field"
                          />
                          <input
                            type="text"
                            name="cvv"
                            placeholder="CVV"
                            value={formData.cvv}
                            onChange={handleChange}
                            className="input-field"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn btn-outline"
                    onClick={handlePrevStep}
                  >
                    ← Back to Shipping
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-small"></span>
                        Processing...
                      </>
                    ) : (
                      formData.paymentMethod === 'cod'
                        ? `Place Order - ₹${total.toFixed(0)}`
                        : `Pay ₹${total.toFixed(0)}`
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="checkout-summary animate-slide-in-right">
            <h2>
              <span className="summary-icon">📦</span>
              Order Summary
            </h2>

            <div className="summary-items">
              {cart.map((item, index) => (
                <div key={item.id} className="summary-item animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="item-image-wrapper">
                    <img src={getCartItemImage(item)} alt={getCartItemName(item)} />
                    <span className="item-quantity-badge">{item.quantity}</span>
                  </div>
                  <div className="summary-item-info">
                    <h4>{getCartItemName(item)}</h4>
                    <p className="item-variant">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </p>
                  </div>
                  <span className="item-price">{formatINR(getCartItemPrice(item) * item.quantity * exchangeRate)}</span>
                </div>
              ))}
            </div>

            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(0)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'free-shipping' : ''}>
                  {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(0)}`}
                </span>
              </div>
              <div className="summary-row">
                <span>GST (18%)</span>
                <span>₹{tax.toFixed(0)}</span>
              </div>
              
              {shipping > 0 && (
                <div className="shipping-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${(subtotal / 4150) * 100}%` }}
                    ></div>
                  </div>
                  <p className="shipping-note">
                    🚚 Add ₹{(4150 - subtotal).toFixed(0)} more for free shipping!
                  </p>
                </div>
              )}

              <div className="summary-divider"></div>

              <div className="summary-row total">
                <span>Total</span>
                <span className="total-amount">₹{total.toFixed(0)}</span>
              </div>
            </div>

            <div className="summary-features">
              <div className="feature">
                <span className="feature-icon">🔒</span>
                <span>Secure Payment</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🚚</span>
                <span>Free Shipping</span>
              </div>
              <div className="feature">
                <span className="feature-icon">↩️</span>
                <span>Easy Returns</span>
              </div>
            </div>

            <div className="payment-methods">
              <span className="payment-icon">💳</span>
              <span className="payment-icon">📱</span>
              <span className="payment-icon">🏦</span>
              <span className="payment-icon">💰</span>
            </div>

            <p className="secure-note">
              <span className="lock-icon">🔒</span>
              Your information is secure and encrypted
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
