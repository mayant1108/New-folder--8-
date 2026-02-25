import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Generate products array with 180+ items
const generateProducts = () => {
  const categories = ['Electronics', 'Fashion', 'Beauty', 'Sports', 'Home & Garden', 'Books'];
  const products = [];
  
  const productNames = {
    Electronics: ['Wireless Headphones', 'Smart Watch', 'Bluetooth Speaker', 'Gaming Mouse', 'USB Cable', 'Power Bank', 'Webcam', 'Microphone', 'Monitor Stand', 'Laptop Stand', 'Phone Case', 'Tablet Cover', 'Screen Protector', 'Smart Bulb', 'Security Camera', 'Doorbell Camera', 'Smart Plug', 'LED Strip', 'Portable SSD', 'Memory Card', 'Card Reader', 'HDMI Cable', 'Ethernet Cable', 'Phone Holder', 'Car Charger', 'FM Transmitter', 'Audio Splitter', 'LAN Adapter', 'Stylus Pen', 'Pop Socket'],
    Fashion: ['Denim Jacket', 'Cotton T-Shirt', 'Casual Hoodie', 'Slim Jeans', 'Leather Belt', 'Running Shorts', 'Wool Sweater', 'Polo Shirt', 'Leather Wallet', 'Canvas Backpack', 'Dress Pants', 'Linen Shirt', 'Sports Bra', 'Winter Jacket', 'Ankle Boots', 'Sneakers', 'Formal Dress', 'Silk Scarf', 'Baseball Cap', 'Socks Pack', 'Yoga Pants', 'Watch Band', 'Evening Clutch', 'Cardigan', 'Pajama Set', 'Rain Jacket', 'Tank Top', 'Pencil Skirt', 'Baseball Jacket', 'Flip Flops'],
    Beauty: ['Moisturizing Cream', 'Lipstick Set', 'Eye Shadow Palette', 'Face Mask', 'Makeup Brush Set', 'Perfume', 'Nail Polish', 'Hair Straightener', 'Face Primer', 'Foundation', 'Cleansing Oil', 'Eyebrow Pencil', 'Mascara', 'Hair Mask', 'Blush', 'Sunscreen', 'Contour Kit', 'Lip Balm', 'Exfoliator', 'Setting Spray', 'Hair Serum', 'Concealer', 'Toner', 'Highlighter', 'Nail Care Kit', 'Eye Cream', 'Body Lotion', 'Facial Cleanser', 'Lip Gloss'],
    Sports: ['Basketball', 'Soccer Ball', 'Tennis Racket', 'Golf Club Set', 'Dumbbells', 'Resistance Bands', 'Boxing Gloves', 'Running Belt', 'Swimming Goggles', 'Cycling Helmet', 'Jump Rope', 'Foam Roller', 'Yoga Blocks', 'Pull Up Bar', 'Ab Roller', 'Kettlebell', 'Exercise Mat', 'Weight Plate', 'Barbell', 'Bench Press', 'Rowing Machine', 'Stationary Bike', 'Treadmill', 'Resistance Tubes', 'Gym Bag', 'Sports Towel', 'Water Bottle', 'Protein Shaker', 'Gym Gloves', 'Weight Scale'],
    'Home & Garden': ['Plant Pot', 'Garden Hose', 'Tool Set', 'Cushion Cover', 'Curtain Rod', 'Picture Frame', 'Wall Clock', 'Table Lamp', 'Floor Lamp', 'Rug', 'Pillow', 'Blanket', 'Sheet Set', 'Towel Set', 'Bath Mat', 'Shower Curtain', 'Door Mat', 'Storage Box', 'Drawer Organizer', 'Closet Organizer', 'Shoe Rack', 'Bookshelf', 'Coffee Table', 'Side Table', 'Mirror', 'Vase', 'Candle', 'Wall Art', 'Planter', 'Garden Tools'],
    Books: ['Novel', 'Cookbook', 'Self-Help Book', 'Biography', 'History Book', 'Science Fiction', 'Fantasy Novel', 'Mystery Thriller', 'Romance Novel', 'Business Book', 'Art Book', 'Photography Book', 'Travel Guide', 'Children Book', 'Poetry Collection', 'Comic Book', 'Graphic Novel', 'Textbook', 'Dictionary', 'Encyclopedia']
  };

  const images = {
    Electronics: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600', 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=600', 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600'],
    Fashion: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'],
    Beauty: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600', 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600', 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600'],
    Sports: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600', 'https://images.unsplash.com/photo-1519861531473-92002639313cc?w=600', 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600', 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600'],
    'Home & Garden': ['https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600'],
    Books: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600', 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600', 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600']
  };

  let id = 1;
  
  categories.forEach(category => {
    const names = productNames[category];
    const categoryImages = images[category];
    
    names.forEach((name, index) => {
      const basePrice = Math.floor(Math.random() * 400) + 20;
      const discount = Math.random() * 0.4 + 0.1;
      const originalPrice = Math.round(basePrice * (1 + discount) * 100) / 100;
      
      products.push({
        id: String(id++),
        name: `${category === 'Books' ? '' : 'Premium '}${name}`,
        description: `High-quality ${name.toLowerCase()} for everyday use. Premium materials and excellent craftsmanship ensure long-lasting satisfaction.`,
        price: basePrice,
        originalPrice,
        images: [categoryImages[index % categoryImages.length]],
        category,
        stock: Math.floor(Math.random() * 200) + 20,
        rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
        reviews: Math.floor(Math.random() * 500) + 10,
        featured: Math.random() > 0.8,
        sizes: category === 'Fashion' ? ['S', 'M', 'L', 'XL'] : [],
        colors: ['Black', 'White', 'Blue', 'Red', 'Green'].slice(0, Math.floor(Math.random() * 4) + 1)
      });
    });
  });
  
  return products;
};

// In-memory database
const db = {
  users: [],
  products: generateProducts(),
  categories: [
    { id: '1', name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400' },
    { id: '2', name: 'Fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400' },
    { id: '3', name: 'Beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400' },
    { id: '4', name: 'Sports', image: 'https://images.unsplash.com/photo-1461896836934-5d9a5a6a1f8e?w=400' },
    { id: '5', name: 'Home & Garden', image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400' },
    { id: '6', name: 'Books', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400' }
  ],
  carts: {},
  orders: []
};

// Auth routes
app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  
  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  const user = {
    id: uuidv4(),
    email,
    password,
    name,
    role: 'user',
    createdAt: new Date().toISOString()
  };
  
  db.users.push(user);
  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = db.users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

app.get('/api/auth/profile', (req, res) => {
  const userId = req.headers['user-id'];
  const user = db.users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// Products routes
app.get('/api/products', (req, res) => {
  let { category, minPrice, maxPrice, sort, search, featured } = req.query;
  
  let products = [...db.products];
  
  if (category) {
    products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  
  if (minPrice) {
    products = products.filter(p => p.price >= parseFloat(minPrice));
  }
  
  if (maxPrice) {
    products = products.filter(p => p.price <= parseFloat(maxPrice));
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    products = products.filter(p => 
      p.name.toLowerCase().includes(searchLower) || 
      p.description.toLowerCase().includes(searchLower)
    );
  }
  
  if (featured === 'true') {
    products = products.filter(p => p.featured);
  }
  
  if (sort === 'price_asc') {
    products.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    products.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    products.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'popularity') {
    products.sort((a, b) => b.reviews - a.reviews);
  }
  
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = db.products.find(p => p.id === req.params.id);
  
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  res.json(product);
});

app.post('/api/products', (req, res) => {
  const product = {
    id: uuidv4(),
    ...req.body,
    rating: 0,
    reviews: 0
  };
  
  db.products.push(product);
  res.status(201).json(product);
});

app.put('/api/products/:id', (req, res) => {
  const index = db.products.findIndex(p => p.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  db.products[index] = { ...db.products[index], ...req.body };
  res.json(db.products[index]);
});

app.delete('/api/products/:id', (req, res) => {
  const index = db.products.findIndex(p => p.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  db.products.splice(index, 1);
  res.json({ message: 'Product deleted' });
});

// Categories routes
app.get('/api/categories', (req, res) => {
  res.json(db.categories);
});

// Cart routes
app.get('/api/cart', (req, res) => {
  const userId = req.headers['user-id'] || 'guest';
  
  if (!db.carts[userId]) {
    db.carts[userId] = [];
  }
  
  const cartItems = db.carts[userId].map(item => {
    const product = db.products.find(p => p.id === item.productId);
    return {
      ...item,
      product
    };
  });
  
  res.json(cartItems);
});

app.post('/api/cart/add', (req, res) => {
  const userId = req.headers['user-id'] || 'guest';
  const { productId, quantity, size, color } = req.body;
  
  if (!db.carts[userId]) {
    db.carts[userId] = [];
  }
  
  const existingItem = db.carts[userId].find(
    item => item.productId === productId && item.size === size && item.color === color
  );
  
  if (existingItem) {
    existingItem.quantity += quantity || 1;
  } else {
    db.carts[userId].push({
      id: uuidv4(),
      productId,
      quantity: quantity || 1,
      size,
      color
    });
  }
  
  res.json({ message: 'Item added to cart' });
});

app.put('/api/cart/update', (req, res) => {
  const userId = req.headers['user-id'] || 'guest';
  const { productId, quantity, size, color } = req.body;
  
  if (!db.carts[userId]) {
    return res.status(404).json({ message: 'Cart not found' });
  }
  
  const item = db.carts[userId].find(
    item => item.productId === productId && item.size === size && item.color === color
  );
  
  if (item) {
    item.quantity = quantity;
  }
  
  res.json({ message: 'Cart updated' });
});

app.delete('/api/cart/remove/:productId', (req, res) => {
  const userId = req.headers['user-id'] || 'guest';
  const { size, color } = req.query;
  
  if (!db.carts[userId]) {
    return res.status(404).json({ message: 'Cart not found' });
  }
  
  db.carts[userId] = db.carts[userId].filter(
    item => !(item.productId === req.params.productId && item.size === size && item.color === color)
  );
  
  res.json({ message: 'Item removed from cart' });
});

app.delete('/api/cart', (req, res) => {
  const userId = req.headers['user-id'] || 'guest';
  db.carts[userId] = [];
  res.json({ message: 'Cart cleared' });
});

// Orders routes
app.get('/api/orders', (req, res) => {
  const userId = req.headers['user-id'];
  
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const orders = db.orders.filter(o => o.userId === userId);
  res.json(orders);
});

app.get('/api/orders/:id', (req, res) => {
  const order = db.orders.find(o => o.id === req.params.id);
  
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  
  res.json(order);
});

app.post('/api/orders', (req, res) => {
  const { userId, items, shippingAddress, paymentMethod, total } = req.body;
  
  const order = {
    id: uuidv4(),
    userId,
    items,
    total,
    status: 'pending',
    shippingAddress,
    paymentMethod,
    createdAt: new Date().toISOString()
  };
  
  db.orders.push(order);
  
  // Clear cart after order
  if (userId && db.carts[userId]) {
    db.carts[userId] = [];
  }
  
  res.status(201).json(order);
});

app.put('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const order = db.orders.find(o => o.id === req.params.id);
  
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  
  order.status = status;
  res.json(order);
});

// Admin routes
app.get('/api/admin/orders', (req, res) => {
  res.json(db.orders);
});

app.get('/api/admin/users', (req, res) => {
  const usersWithoutPassword = db.users.map(u => {
    const { password, ...user } = u;
    return user;
  });
  res.json(usersWithoutPassword);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Loaded ${db.products.length} products`);
});
