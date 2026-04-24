import Product from '../models/Product.js';
import User from '../models/User.js';

const demoProducts = [
  {
    name: 'Premium Wireless Headphones',
    description: 'Noise-cancelling wireless headphones with long battery life and rich sound.',
    price: 249.99,
    originalPrice: 399.99,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
    category: 'Electronics',
    stock: 50,
    rating: 4.8,
    reviews: 234,
    featured: true,
    colors: ['Black', 'White', 'Silver'],
    sku: 'DEMO-ELEC-001'
  },
  {
    name: 'Smart Fitness Watch Pro',
    description: 'Fitness watch with GPS, heart-rate tracking, sleep insights, and a bright display.',
    price: 199.99,
    originalPrice: 299.99,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'],
    category: 'Electronics',
    stock: 100,
    rating: 4.6,
    reviews: 189,
    featured: true,
    sizes: ['40mm', '44mm'],
    colors: ['Black', 'Rose Gold', 'Silver'],
    sku: 'DEMO-ELEC-002'
  },
  {
    name: 'Mechanical Keyboard RGB',
    description: 'Tactile mechanical keyboard with per-key RGB lighting and durable switches.',
    price: 159.99,
    originalPrice: 219.99,
    images: ['https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=600'],
    category: 'Electronics',
    stock: 45,
    rating: 4.8,
    reviews: 189,
    featured: true,
    colors: ['Black', 'White'],
    sku: 'DEMO-ELEC-003'
  },
  {
    name: 'Classic Denim Jacket',
    description: 'Timeless denim jacket with a comfortable fit and vintage wash.',
    price: 89.99,
    originalPrice: 129.99,
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600'],
    category: 'Fashion',
    stock: 80,
    rating: 4.5,
    reviews: 234,
    featured: true,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blue', 'Black', 'Light Blue'],
    sku: 'DEMO-FASH-001'
  },
  {
    name: 'Ultra Comfort Running Shoes',
    description: 'Lightweight shoes with responsive cushioning and breathable mesh.',
    price: 129.99,
    originalPrice: 179.99,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'],
    category: 'Fashion',
    stock: 75,
    rating: 4.7,
    reviews: 312,
    featured: true,
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['Red', 'Black', 'Blue', 'White'],
    sku: 'DEMO-FASH-002'
  },
  {
    name: 'Organic Face Serum Set',
    description: 'Daily skincare serum set with vitamin C, hyaluronic acid, and retinol.',
    price: 79.99,
    originalPrice: 119.99,
    images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600'],
    category: 'Beauty',
    stock: 60,
    rating: 4.4,
    reviews: 98,
    featured: true,
    sku: 'DEMO-BEAU-001'
  },
  {
    name: 'Lipstick Set',
    description: 'Set of six matte lipsticks with a smooth, long-lasting formula.',
    price: 39.99,
    originalPrice: 59.99,
    images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600'],
    category: 'Beauty',
    stock: 150,
    rating: 4.6,
    reviews: 345,
    colors: ['Red', 'Pink', 'Nude', 'Berry'],
    sku: 'DEMO-BEAU-002'
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Extra-thick eco-friendly yoga mat with non-slip texture.',
    price: 49.99,
    originalPrice: 79.99,
    images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600'],
    category: 'Sports',
    stock: 150,
    rating: 4.7,
    reviews: 234,
    featured: true,
    sizes: ['3mm', '5mm', '7mm'],
    colors: ['Purple', 'Blue', 'Green'],
    sku: 'DEMO-SPRT-001'
  },
  {
    name: 'Dumbbells Set',
    description: 'Adjustable dumbbell pair for home workouts and strength training.',
    price: 249.99,
    originalPrice: 349.99,
    images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600'],
    category: 'Sports',
    stock: 40,
    rating: 4.6,
    reviews: 234,
    sku: 'DEMO-SPRT-002'
  },
  {
    name: 'Minimal Table Lamp',
    description: 'Warm LED table lamp with a compact design for desks and bedside tables.',
    price: 64.99,
    originalPrice: 89.99,
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600'],
    category: 'Home & Garden',
    stock: 70,
    rating: 4.5,
    reviews: 164,
    featured: true,
    colors: ['White', 'Black'],
    sku: 'DEMO-HOME-001'
  },
  {
    name: 'Ceramic Plant Pot',
    description: 'Modern ceramic pot for indoor plants with drainage and matte finish.',
    price: 24.99,
    originalPrice: 39.99,
    images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600'],
    category: 'Home & Garden',
    stock: 180,
    rating: 4.4,
    reviews: 212,
    sku: 'DEMO-HOME-002'
  },
  {
    name: 'Mystery Thriller Novel',
    description: 'A fast-paced thriller for weekend reading and late-night page turning.',
    price: 18.99,
    originalPrice: 28.99,
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600'],
    category: 'Books',
    stock: 120,
    rating: 4.3,
    reviews: 96,
    featured: true,
    sku: 'DEMO-BOOK-001'
  }
];

const ensureUser = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });

  if (!existingUser) {
    await User.create(userData);
  }
};

const seedDemoData = async () => {
  const productCount = await Product.countDocuments();

  if (productCount === 0) {
    await Product.insertMany(demoProducts);
    console.log(`Seeded ${demoProducts.length} demo products`);
  }

  await ensureUser({
    name: 'Demo User',
    email: 'demo@shophub.com',
    password: 'demo123',
    role: 'user'
  });

  await ensureUser({
    name: 'Admin User',
    email: 'admin@shophub.com',
    password: 'admin123',
    role: 'admin'
  });
};

export default seedDemoData;
