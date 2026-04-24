# ShopHub - Full Stack E-Commerce Website

A complete full-stack online shopping website built with modern technologies.

## 🚀 Tech Stack

### Frontend
- **React.js** - UI Framework
- **Custom CSS** - Styling (modern dark theme)
- **React Router** - Navigation
- **Stripe.js** - Payment Integration

### Backend
- **Node.js** - JavaScript Runtime
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password Hashing
- **Stripe** - Payment Processing

---

## 📁 Project Structure

```
shopzone/
├── backend/                    # Backend Server
│   ├── config/
│   │   └── db.js              # MongoDB Connection
│   ├── controllers/            # Route Controllers (MVC)
│   │   ├── userController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   └── cartController.js
│   ├── middleware/
│   │   └── auth.js            # JWT Authentication
│   ├── models/                # Mongoose Models
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Cart.js
│   ├── routes/                # Express Routes
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   └── cartRoutes.js
│   ├── .env                   # Environment Variables
│   ├── server.js              # Main Server File
│   └── package.json
│
└── frontend/                   # React Frontend
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── Toast.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Products.jsx
    │   │   ├── ProductDetail.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Checkout.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   └── Admin.jsx
    │   ├── utils/
    │   │   └── api.js         # API Helper Functions
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    └── vite.config.js
```

---

## 🔧 How to Run the Project

### Prerequisites
1. **Node.js** - Download & Install from https://nodejs.org
2. **MongoDB** - Download & Install from https://www.mongodb.com/try/download/community
   - OR use MongoDB Atlas (cloud)

### Step 1: Start MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB service (Windows)
net start MongoDB

# OR start manually
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update MONGODB_URI in backend/.env

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3: Configure Environment Variables

Edit `backend/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shophub
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

### Step 4: Start Backend Server

```bash
cd backend
npm run dev
```
Server will run on http://localhost:5000

### Step 5: Seed Products (First Time Only)

Open a new terminal and run:
```bash
curl -X POST http://localhost:5000/api/products/seed
```

This will create 60 sample products in the database.

### Step 6: Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Step 7: Start Frontend

```bash
cd frontend
npm run dev
```
Frontend will run on http://localhost:3000

---

## 📌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get user profile (Protected) |
| PUT | `/api/auth/profile` | Update profile (Protected) |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get single product |
| GET | `/api/products/featured` | Get featured products |
| GET | `/api/products/categories` | Get categories |
| POST | `/api/products` | Create product (Admin) |
| PUT | `/api/products/:id` | Update product (Admin) |
| DELETE | `/api/products/:id` | Delete product (Admin) |
| POST | `/api/products/seed` | Seed sample products |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create order |
| GET | `/api/orders` | Get user's orders |
| GET | `/api/orders/:id` | Get order by ID |
| GET | `/api/orders/admin/all` | Get all orders (Admin) |
| PUT | `/api/orders/:id/status` | Update order status (Admin) |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get cart |
| POST | `/api/cart` | Add to cart |
| PUT | `/api/cart` | Update cart item |
| DELETE | `/api/cart/item/:id` | Remove from cart |
| DELETE | `/api/cart` | Clear cart |

### Payment
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payment/create-intent` | Create payment intent |
| GET | `/api/payment/config` | Get Stripe public key |

---

## 🔐 Default Admin Account

After seeding, you can create an admin user through:

1. Register a new account at http://localhost:3000/register
2. In MongoDB, manually change the user's role to "admin":

```javascript
// In MongoDB shell
use shophub
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

---

## 🛠 Features

### User Features
- ✅ User Registration & Login (JWT)
- ✅ Product Browsing & Search
- ✅ Product Categories
- ✅ Add to Cart
- ✅ Remove from Cart
- ✅ Order Placement
- ✅ Order History
- ✅ User Dashboard

### Admin Features
- ✅ Admin Dashboard
- ✅ Add New Products
- ✅ Edit Products
- ✅ Delete Products
- ✅ View All Orders
- ✅ Update Order Status

### Technical Features
- ✅ REST API Architecture
- ✅ MVC Pattern (Backend)
- ✅ JWT Authentication
- ✅ MongoDB Database
- ✅ Password Hashing
- ✅ Protected Routes
- ✅ Payment Integration (Stripe)

---

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/shophub
JWT_SECRET=your_secret_key_here
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

---

## 🚨 Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check MONGODB_URI in .env file

### CORS Error
- Update FRONTEND_URL in backend/.env

### JWT Error
- Make sure JWT_SECRET is set in .env
- Check if token is being sent in headers

### Port Already in Use
- Change PORT in backend/.env
- Or kill the process using the port

---

## 📄 License

This project is for educational purposes.

---

## 👨‍💻 Created By

ShopHub - Full Stack E-Commerce Solution

