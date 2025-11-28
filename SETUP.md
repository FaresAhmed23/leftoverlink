# 🍽️ LeftoverLink Setup Guide

## Complete Food Sharing Platform - Frontend & Backend

This guide will help you set up the complete LeftoverLink application with React frontend, Node.js backend, and MongoDB database.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone and Setup Frontend

```bash
# Install frontend dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 2. Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your MongoDB connection and secrets
nano .env
```

### 3. Configure Environment Variables

Edit `backend/.env` with your settings:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/leftoverlink
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
```

### 4. Start Backend Server

```bash
# In backend directory
npm run dev
```

The backend API will be available at `http://localhost:5000`

## 🔧 Technology Stack

### Frontend
- **React 19** - Modern UI library with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Beautiful SVG icons
- **Axios** - HTTP client for API calls
- **Vite** - Fast build tool and dev server

### Backend
- **Node.js & Express** - Server runtime and framework
- **MongoDB & Mongoose** - Database and ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

## 🌟 Features Implemented

### ✅ Landing Page & Authentication
- **Modern landing page** with hero section, features, and call-to-action
- **User registration & login** with JWT authentication
- **Role-based access** (Donors, Recipients, Charities)
- **Responsive design** that works on all devices

### ✅ Location-Based Food Discovery
- **Automatic location detection** using HTML5 Geolocation
- **Distance calculation** to show nearest food sources
- **Interactive map integration** with Google Maps directions
- **Location-based sorting** of food listings

### ✅ Smart Food Listings
- **Real-time expiration tracking** with color-coded urgency
- **Category filtering** (prepared food, baked goods, produce, etc.)
- **Search functionality** across titles, descriptions, and locations
- **Allergen information** for safety
- **Pickup instructions** and contact details

### ✅ User Dashboard
- **Modern sidebar navigation** with responsive mobile menu
- **User statistics** and impact tracking
- **Profile management** with preferences
- **Listing management** for food donors

### ✅ Backend API
- **RESTful API design** with proper HTTP status codes
- **MongoDB integration** with Mongoose ODM
- **JWT authentication** with secure password hashing
- **Input validation** and error handling
- **Geospatial queries** for location-based features
- **Rate limiting** and security middleware

## 🛠️ Development Workflow

### Frontend Development
```bash
# Run frontend in development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Development
```bash
# Run backend with auto-restart
cd backend
npm run dev

# Run in production mode
npm start
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Listings
- `GET /api/listings` - Get all listings with filters
- `GET /api/listings/:id` - Get single listing
- `POST /api/listings` - Create new listing (donors only)
- `PUT /api/listings/:id` - Update listing (owner only)
- `POST /api/listings/:id/claim` - Claim a listing
- `DELETE /api/listings/:id` - Delete listing (owner only)

### Location
- `PUT /api/location` - Update user location
- `GET /api/location/nearby` - Find nearby users/listings
- `GET /api/location/geocode` - Geocode address (requires Google Maps API)

### Users
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/listings` - Get user's listings
- `GET /api/users/claims` - Get user's claims

## 🎨 Design System

### Colors
- **Primary Blue**: #0ea5e9 (primary-500)
- **Green Accent**: #22c55e (green-500)
- **Warning Orange**: #f97316 (orange-500)
- **Error Red**: #ef4444 (red-500)
- **Gray Scale**: gray-50 to gray-900

### Components
- **Cards**: Rounded corners, subtle shadows, hover effects
- **Buttons**: Gradient backgrounds, smooth transitions
- **Forms**: Clean inputs with focus states
- **Navigation**: Responsive with mobile-first design

## 🔒 Security Features

### Frontend Security
- **Input sanitization** and validation
- **XSS protection** through React's built-in escaping
- **Secure token storage** in localStorage
- **HTTPS enforcement** in production

### Backend Security
- **JWT authentication** with secure secret keys
- **Password hashing** using bcrypt with salt rounds
- **Rate limiting** to prevent abuse
- **Helmet.js** for security headers
- **Input validation** using express-validator
- **CORS configuration** for allowed origins

## 🌍 Environmental Impact Features

### Impact Tracking
- **Food items saved** from waste
- **CO₂ emissions reduced** through waste prevention
- **Meals provided** to people in need
- **Community impact** statistics

### Sustainability
- **Food waste reduction** by connecting surplus to need
- **Local food sharing** to minimize transportation
- **Community building** around sustainability
- **Environmental awareness** through impact metrics

## 📊 Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  userType: ['donor', 'recipient', 'charity'],
  organization: String,
  location: GeoJSON Point,
  preferences: Object,
  stats: Object,
  verified: Boolean
}
```

### Listings Collection
```javascript
{
  title: String,
  description: String,
  category: String,
  quantity: String,
  expiryTime: Date,
  allergens: [String],
  location: GeoJSON Point,
  donor: ObjectId (ref: User),
  status: String,
  claims: [Object],
  verified: Boolean
}
```

## 🚀 Deployment

### Frontend Deployment (Netlify/Vercel)
```bash
# Build production version
npm run build

# Deploy dist/ folder to your hosting platform
```

### Backend Deployment (Railway/Render/Heroku)
```bash
# Set environment variables on your platform
NODE_ENV=production
MONGODB_URI=your-production-mongo-uri
JWT_SECRET=your-production-jwt-secret

# Deploy backend code to your platform
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- **GitHub Issues**: Report bugs and request features
- **Documentation**: Check this README for setup help
- **Community**: Join our Discord for discussions

---

**Built with ❤️ for reducing food waste and building stronger communities**