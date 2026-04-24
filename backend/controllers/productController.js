import Product from '../models/Product.js';
import { v4 as uuidv4 } from 'uuid';

const defaultCategoryImages = {
  Electronics: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
  Fashion: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600',
  Beauty: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600',
  Sports: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600',
  'Home & Garden': 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600',
  Books: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600'
};

const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const slugify = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sort, search, featured, page = 1, limit = 50 } = req.query;

    let query = {};
    const pageNumber = Math.max(Number.parseInt(page, 10) || 1, 1);
    const limitNumber = Math.max(Number.parseInt(limit, 10) || 50, 1);

    // Category filter
    if (category) {
      const matchedCategory = Product.schema.path('category').enumValues.find(
        (categoryName) => slugify(categoryName) === slugify(category) || categoryName.toLowerCase() === category.trim().toLowerCase()
      );

      query.category = {
        $regex: `^${escapeRegex(matchedCategory || category.trim())}$`,
        $options: 'i'
      };
    }

    // Price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Featured filter
    if (featured === 'true') {
      query.featured = true;
    }

    // Sort options
    let sortOption = {};
    switch (sort) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
      case 'popularity':
        sortOption = { reviews: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const products = await Product.find(query)
      .sort(sortOption)
      .limit(limitNumber)
      .skip((pageNumber - 1) * limitNumber);

    const count = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(count / limitNumber),
      currentPage: pageNumber,
      totalProducts: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, images, stock, sizes, colors, brand, featured } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      originalPrice: price,
      category,
      images: images || [],
      stock: stock || 0,
      sizes: sizes || [],
      colors: colors || [],
      brand: brand || '',
      featured: featured || false,
      sku: `SKU-${uuidv4().slice(0, 8).toUpperCase()}`
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).limit(8);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get categories
// @route   GET /api/products/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const products = await Product.find({}, 'category images').lean();
    const categoriesMap = new Map();

    products.forEach((product) => {
      if (!product.category) {
        return;
      }

      const image = product.images?.[0] || defaultCategoryImages[product.category] || '';
      const existingCategory = categoriesMap.get(product.category);

      if (existingCategory) {
        existingCategory.productCount += 1;
        if (!existingCategory.image && image) {
          existingCategory.image = image;
        }
        return;
      }

      categoriesMap.set(product.category, {
        id: slugify(product.category),
        slug: slugify(product.category),
        name: product.category,
        image,
        productCount: 1
      });
    });

    const categories = Array.from(categoriesMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Seed initial products (for demo)
// @route   POST /api/products/seed
// @access  Public
export const seedProducts = async (req, res) => {
  try {
    // Check if products already exist
    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      return res.status(400).json({ message: 'Products already seeded' });
    }

    const categories = ['Electronics', 'Fashion', 'Beauty', 'Sports', 'Home & Garden', 'Books'];
    
    const productNames = {
      Electronics: ['Wireless Headphones', 'Smart Watch', 'Bluetooth Speaker', 'Gaming Mouse', 'USB Cable', 'Power Bank', 'Webcam', 'Microphone', 'Monitor Stand', 'Laptop Stand'],
      Fashion: ['Denim Jacket', 'Cotton T-Shirt', 'Casual Hoodie', 'Slim Jeans', 'Leather Belt', 'Running Shorts', 'Wool Sweater', 'Polo Shirt', 'Leather Wallet', 'Canvas Backpack'],
      Beauty: ['Moisturizing Cream', 'Lipstick Set', 'Eye Shadow Palette', 'Face Mask', 'Makeup Brush Set', 'Perfume', 'Nail Polish', 'Hair Straightener', 'Face Primer', 'Foundation'],
      Sports: ['Basketball', 'Soccer Ball', 'Tennis Racket', 'Golf Club Set', 'Dumbbells', 'Resistance Bands', 'Boxing Gloves', 'Running Belt', 'Swimming Goggles', 'Cycling Helmet'],
      'Home & Garden': ['Plant Pot', 'Garden Hose', 'Tool Set', 'Cushion Cover', 'Curtain Rod', 'Picture Frame', 'Wall Clock', 'Table Lamp', 'Floor Lamp', 'Rug'],
      Books: ['Novel', 'Cookbook', 'Self-Help Book', 'Biography', 'History Book', 'Science Fiction', 'Fantasy Novel', 'Mystery Thriller', 'Romance Novel', 'Business Book']
    };

    const images = {
      Electronics: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
      Fashion: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600'],
      Beauty: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600'],
      Sports: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600'],
      'Home & Garden': ['https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600'],
      Books: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600']
    };

    const productsToInsert = [];

    categories.forEach(category => {
      const names = productNames[category];
      names.forEach((name, index) => {
        const basePrice = Math.floor(Math.random() * 400) + 20;
        const discount = Math.random() * 0.4 + 0.1;
        const originalPrice = Math.round(basePrice * (1 + discount) * 100) / 100;

        productsToInsert.push({
          name: `Premium ${name}`,
          description: `High-quality ${name.toLowerCase()} for everyday use. Premium materials and excellent craftsmanship ensure long-lasting satisfaction.`,
          price: basePrice,
          originalPrice,
          category,
          images: [images[category][0]],
          stock: Math.floor(Math.random() * 200) + 20,
          rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
          reviews: Math.floor(Math.random() * 500) + 10,
          featured: Math.random() > 0.8,
          sizes: category === 'Fashion' ? ['S', 'M', 'L', 'XL'] : [],
          colors: ['Black', 'White', 'Blue', 'Red', 'Green'].slice(0, Math.floor(Math.random() * 4) + 1),
          sku: `SKU-${uuidv4().slice(0, 8).toUpperCase()}`
        });
      });
    });

    const products = await Product.insertMany(productsToInsert);
    res.status(201).json({ message: `${products.length} products seeded`, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

