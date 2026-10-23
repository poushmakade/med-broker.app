# PharmaSense - AI-Powered Pharmaceutical Intelligence & Inventory Platform

> **Seminar Project (Session 2026-27 | Semester VI)**  
> **Department of Computer Science & Engineering (AIML)**  
> **Shri Ramdeobaba College of Engineering & Management, Nagpur**  
> Guided by: **Prof. Harshita Patil**  
> Team: **Kartikeya Kalbandhe (55), Mohit Mohatkar (57), Poush Makade (59), Rudra Bambal (60), Viplav Bhure (63)**

PharmaSense is an AI-powered pharmaceutical platform designed to unify medicine commerce between verified Indian suppliers and healthcare buyers, powered by deep learning sequence models for demand forecasting and stockout prevention.

---

## 🎯 Current Milestone: 30% - 40% Core Progress

- **RBAC Simplification**: Focused on the two primary market actors:
  - 👤 **Customer (Buyer)**: Unified multi-vendor catalog, symptom-based AI assistance, order workflows, and transparent tiered pricing.
  - 🏢 **Vendor (Supplier)**: Inventory listings, incoming orders, and AI predictive demand forecasting.
- **Flagship AI Module**: **Demand Forecasting** (evaluating historical orders, 3-month seasonality, and price elasticity to prevent stockouts and overstock).
- **Compliance & Trust Gate**: Integrated GSTIN and Drug License onboarding verification.
- **Refreshed Visual Identity**: Modern corporate pharmaceutical intelligence theme.

## 🚀 Features

### Authentication & Authorization
- **Role-Based Access Control**: Dual workflows for Customers and Vendors
- **Secure Authentication**: JWT-based session security with bcrypt password hashing
- **Profile Onboarding**: Streamlined compliance collection (GSTIN, Drug License)

### User Roles

#### 👤 Customer (Buyer)
- **Retail & Wholesale Buyers**: Clinics, hospitals, pharmacies, and patients
- Browse medicine catalog with multi-vendor dynamic comparisons
- Order tracking and checkout

#### 🏢 Vendor (Supplier)
- Verify business with GSTIN and Drug License details
- Manage medicine catalog and stock
- **AI Demand Forecasting**: Sequence-modeled 30-day look-ahead predictions with restock suggestions

### Technical & AI Features
- **AI Sequence Demand Forecasting**: PyTorch / ONNX LSTM sequence modeling for pharmaceutical supply chains
- **Dynamic Pricing Engine**: Real-time tiered bulk discount calculations
- **AI Health Assistant**: Transformer NLP symptom guidance
- **Multi-Currency Support**: Real-time FX conversion for cross-border trade

## 🏗️ Architecture

```
medicine-marketplace-platform/
├── frontend/          # React + Vite application
├── backend/           # Node.js + Express API
├── ai-ml/             # Python AI/ML services
├── infrastructure/    # Docker & deployment configs
└── docs/              # Documentation
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite 6.4.1
- **Routing**: React Router 6.22.3
- **HTTP Client**: Axios 1.6.7
- **Styling**: Custom CSS with Medical Blue theme

### Backend
- **Runtime**: Node.js
- **Framework**: Express 4.18.2
- **Database**: PostgreSQL (Neon Serverless)
- **ORM**: Prisma 5.22.0
- **Authentication**: JWT (jsonwebtoken 9.0.3)
- **Password Hashing**: bcrypt 3.0.3

### AI/ML
- **Language**: Python
- **Features**: Chatbot, Disease Prediction, Recommendations

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (or Neon account)
- Python 3.8+ (for AI/ML services)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables - Backend:
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` file with your actual values:
```env
# Required variables
NODE_ENV=development
PORT=4000
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
JWT_SECRET="your-super-secret-jwt-key"

# Optional variables
EXCHANGE_RATE_API_KEY="your-api-key"
CORS_ORIGIN="http://localhost:5173,http://localhost:3000"
```

4. Configure environment variables - Frontend:
```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env` file:
```env
# API endpoint (must match backend PORT)
VITE_API_URL=http://localhost:4000/api
VITE_APP_NAME=PharmaSense
```

5. Run database migrations:
```bash
cd backend
npx prisma migrate dev
```

6. Generate Prisma client:
```bash
npx prisma generate
```

7. Start development servers:

Backend:
```bash
cd backend
npm run dev
```

Frontend (in another terminal):
```bash
cd frontend
npm run dev
```

Backend will run on `http://localhost:4000`  
Frontend will run on `http://localhost:5173` (or `http://localhost:3000`)

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000` (or `http://localhost:5173` with Vite)

### AI/ML Setup

1. Navigate to AI/ML directory:
```bash
cd ai-ml
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## 🎯 Usage Guide

### For Customers

1. **Registration**:
   - Visit `http://localhost:3000/register`
   - Choose "Customer" role
   - Provide email, mobile, and password
   - Click "Create Account"

2. **Onboarding**:
   - Fill in full name and address details
   - Select buyer type:
     - **Retail**: For individual purchases
     - **Wholesale**: For business purchases (requires GSTIN)
   - Complete profile

3. **Dashboard Access**:
   - Browse medicine catalog
   - Place orders
   - Track deliveries
   - View invoices

### For Vendors

1. **Registration**:
   - Visit `http://localhost:3000/register`
   - Choose "Vendor" role
   - Provide email, mobile, and password
   - Click "Create Account"

2. **Onboarding**:
   - Enter company name and business details
   - Select vendor type (Pharmacy/Distributor/Manufacturer/Wholesaler)
   - Provide GSTIN (15 characters)
   - Enter Drug License Number
   - Complete address and contact information
   - Submit for verification

3. **After Verification**:
   - Manage inventory
   - Process orders
   - Generate invoices
   - Track sales

### For Admins

1. **Login**:
   - Use admin credentials
   - Access admin dashboard

2. **Vendor Verification**:
   - Review vendor applications
   - Verify GSTIN and Drug License
   - Approve or reject vendors

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/auth/profile-status` - Check profile completion

### Onboarding
- `POST /api/onboarding/vendor` - Complete vendor onboarding
- `POST /api/onboarding/customer` - Complete customer onboarding
- `GET /api/onboarding/status` - Get onboarding status

## 🎨 Design System

### Color Palette
- **Primary**: #1E88E5 (Medical Blue)
- **Secondary**: #43A047 (Soft Green)
- **Success**: #4CAF50
- **Warning**: #FFC107
- **Error**: #F44336
- **Text**: #2C3E50
- **Background**: #F5F7FA

### Typography
- **Font Family**: Inter, system-ui
- **Base Size**: 16px
- **Line Height**: 1.6

## 🔒 Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT tokens with 7-day expiration
- CORS protection with whitelisted origins
- Input validation and sanitization
- Custom error handling with secure error messages
- Role-based access control (RBAC)

## 📚 Database Schema

### Core Models
- **User**: Authentication and role management
- **Vendor**: Business profiles and verification
- **Customer**: Buyer profiles and preferences
- **Medicine**: Product catalog
- **Inventory**: Stock management
- **Order**: Purchase orders
- **Payment**: Transaction records
- **Invoice**: Billing documents

### Enums
- **UserRole**: CUSTOMER, VENDOR, ADMIN
- **VendorType**: PHARMACY, DISTRIBUTOR, MANUFACTURER, WHOLESALER
- **BuyerType**: RETAIL, WHOLESALE
- **VerificationStatus**: PENDING, VERIFIED, REJECTED

## 🚦 Error Handling

Custom error classes for consistent API responses:
- `ValidationError` (400): Invalid input data
- `AuthenticationError` (401): Invalid credentials
- `ForbiddenError` (403): Insufficient permissions
- `NotFoundError` (404): Resource not found
- `ConflictError` (409): Duplicate resource

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🚀 Deployment

### Docker Deployment
```bash
docker-compose up -d
```

### Manual Deployment
1. Build frontend: `npm run build`
2. Configure Nginx reverse proxy
3. Set up PostgreSQL database
4. Run migrations: `npx prisma migrate deploy`
5. Start backend: `npm start`

## 📖 Documentation

Complete documentation is organized into 4 main guides:

1. **[DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)** - Getting started with local development
   - Project setup and installation
   - Authentication system and role-based architecture
   - Database seeding and test data
   - API testing and debugging
   - Development workflow

2. **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design and technical specifications
   - 3-tier architecture overview
   - Technology stack details
   - System layers (Frontend, Backend, Database)
   - Database schema and relationships
   - Data flow diagrams
   - Performance and scalability

3. **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - REST API reference
   - All API endpoints with examples
   - Request/response formats
   - Authentication flows
   - Error handling
   - Rate limiting and best practices

4. **[FEATURES_AND_ROADMAP.md](FEATURES_AND_ROADMAP.md)** - Features, vision, and future plans
   - Problem statement and industry challenges
   - Current implemented features
   - AI/ML capabilities (Chatbot, Disease Prediction, Recommendations)
   - Phase-by-phase roadmap (Phase 2-5 and beyond)
   - Success metrics and investment allocation

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## 📄 License

This project is proprietary software.

## 👥 Team

PharmaSense Development Team — Team Innovatrix

## 📞 Support

For issues and questions, please contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: 2024
```
## Supplied demo dataset

The uploaded medicine dataset has a validated, idempotent Neon import pipeline. See [backend/DATASET_IMPORT.md](backend/DATASET_IMPORT.md) for commands, exact counts, admin API access, and separation of fictional stock/orders from real commerce. Imported medicines remain inactive drafts pending review.
