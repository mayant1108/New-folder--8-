const API_BASE_URL = '/api';

export const normalizeProductsResponse = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.products)) {
    return payload.products;
  }

  return [];
};

export const getCategorySlug = (category) => {
  const name = typeof category === 'string' ? category : category?.slug || category?.name || '';

  return name
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const normalizeCategoriesResponse = (payload) => {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload.map((category) => {
    if (typeof category === 'string') {
      return {
        id: getCategorySlug(category),
        slug: getCategorySlug(category),
        name: category,
        image: '',
        productCount: 0
      };
    }

    return {
      id: category.id || getCategorySlug(category.name),
      slug: category.slug || getCategorySlug(category.name),
      name: category.name,
      image: category.image || '',
      productCount: category.productCount || 0
    };
  });
};

export const getProductId = (product) => product?._id || product?.id || '';

export const normalizeUser = (user = {}) => ({
  ...user,
  id: user.id || user._id || ''
});

export const normalizeCartResponse = (payload) => {
  const rawItems = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.items)
      ? payload.items
      : [];

  return rawItems
    .filter((item) => item?.product || item?.productId)
    .map((item) => {
      const product = typeof item.product === 'object' && item.product !== null
        ? item.product
        : item.productId && typeof item.productId === 'object'
          ? item.productId
          : {};
      const productId = getProductId(product) || item.productId || item.product || '';
      const size = item.size || '';
      const color = item.color || '';

      return {
        id: `${productId}-${size || 'default'}-${color || 'default'}`,
        productId,
        product,
        quantity: Number(item.quantity) || 1,
        size,
        color,
        price: Number(item.price ?? product.price ?? 0)
      };
    });
};

export const normalizeOrder = (order = {}) => {
  const items = Array.isArray(order.items)
    ? order.items
    : Array.isArray(order.orderItems)
      ? order.orderItems
      : [];

  return {
    ...order,
    id: order.id || order._id || '',
    items,
    total: Number(order.total ?? order.totalPrice ?? 0),
    subtotal: Number(order.subtotal ?? order.itemsPrice ?? 0),
    shipping: Number(order.shipping ?? order.shippingPrice ?? 0),
    tax: Number(order.tax ?? order.taxPrice ?? 0),
    status: order.status || 'pending'
  };
};

export const normalizeOrdersResponse = (payload) => {
  const orders = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.orders)
      ? payload.orders
      : [];

  return orders.map(normalizeOrder);
};

export const formatINR = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(amount) || 0);

// Helper function to get token
const getToken = () => {
  return localStorage.getItem('shophub_token');
};

// Helper function for API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Auth API
export const authAPI = {
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  
  getProfile: () => apiRequest('/auth/profile'),
  
  updateProfile: (userData) => apiRequest('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(userData)
  }),

  getUsers: () => apiRequest('/auth/users')
};

// Products API
export const productsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/products${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id) => apiRequest(`/products/${id}`),
  
  getFeatured: () => apiRequest('/products/featured'),
  
  getCategories: () => apiRequest('/products/categories'),
  
  create: (productData) => apiRequest('/products', {
    method: 'POST',
    body: JSON.stringify(productData)
  }),
  
  update: (id, productData) => apiRequest(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData)
  }),
  
  delete: (id) => apiRequest(`/products/${id}`, {
    method: 'DELETE'
  }),
  
  seed: () => apiRequest('/products/seed', {
    method: 'POST'
  })
};

// Orders API
export const ordersAPI = {
  create: (orderData) => apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  }),
  
  getMyOrders: () => apiRequest('/orders'),
  
  getById: (id) => apiRequest(`/orders/${id}`),
  
  updateToPaid: (id, paymentResult) => apiRequest(`/orders/${id}/pay`, {
    method: 'PUT',
    body: JSON.stringify(paymentResult)
  }),
  
  getAll: () => apiRequest('/orders/admin/all'),
  
  getStats: () => apiRequest('/orders/admin/stats'),
  
  updateStatus: (id, status) => apiRequest(`/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  })
};

// Cart API
export const cartAPI = {
  getCart: () => apiRequest('/cart'),
  
  addItem: (itemData) => apiRequest('/cart', {
    method: 'POST',
    body: JSON.stringify(itemData)
  }),
  
  updateItem: (itemData) => apiRequest('/cart', {
    method: 'PUT',
    body: JSON.stringify(itemData)
  }),
  
  removeItem: (productId, size, color) => {
    const params = new URLSearchParams();
    if (size) params.append('size', size);
    if (color) params.append('color', color);
    return apiRequest(`/cart/item/${productId}?${params.toString()}`, {
      method: 'DELETE'
    });
  },
  
  clearCart: () => apiRequest('/cart', {
    method: 'DELETE'
  })
};

// Payment API
export const paymentAPI = {
  createIntent: (amount) => apiRequest('/payment/create-intent', {
    method: 'POST',
    body: JSON.stringify({ amount })
  }),
  
  getConfig: () => apiRequest('/payment/config')
};

export default apiRequest;

