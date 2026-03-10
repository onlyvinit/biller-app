# Billify - Modern Billing & POS System

A comprehensive cloud-based billing solution with an integrated Point of Sale (POS) desktop application. Built for restaurants, retail stores, and service businesses that need seamless billing management and real-time synchronization.

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)
![React](https://img.shields.io/badge/React-19.2.3-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-7.1.0-green)

## 🌟 Features

### Web Dashboard

- **User Authentication** - Secure login/signup with JWT and bcrypt password hashing
- **Real-time Dashboard** - Live statistics for revenue, invoices, and sales
- **Invoice Management** - Create, track, and manage invoices with status updates
- **Biller Portal** - Generate secure access keys for POS terminals
- **Business Management** - Manage items, categories, staff, tables, and offers
- **Email Notifications** - Automated email system via Nodemailer
- **Responsive Design** - Beautiful UI with Tailwind CSS and Framer Motion animations
- **Protected Routes** - Middleware-based authentication and authorization

### Desktop POS Application

- **Secure Authentication** - Access key-based login system
- **Product Catalog** - Browse and search products
- **Cart Management** - Add, remove, and modify cart items
- **Payment Processing** - Process transactions and generate invoices
- **Cloud Sync** - Automatic synchronization with web dashboard
- **Offline Capable** - Works offline and syncs when connection is restored
- **Native Performance** - Built with Python and CustomTkinter

## 🏗️ Architecture

```
billify/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── dashboard/            # Dashboard data endpoints
│   │   └── contact/              # Contact form endpoint
│   ├── dashboard/                # Dashboard pages
│   │   ├── biller-portal/        # Biller management
│   │   ├── billers/              # Biller list
│   │   ├── manage/               # Business management
│   │   ├── sales/                # Sales tracking
│   │   └── settings/             # User settings
│   ├── login/                    # Login page
│   ├── signup/                   # Signup page
│   └── contact/                  # Contact page
├── biller-app/                   # Desktop POS Application
│   ├── main.py                   # Main application code
│   ├── dist/                     # Built executable
│   ├── test_key_verification.py  # Diagnostic tool
│   └── docs/                     # POS documentation
├── components/                   # React components
│   └── ui/                       # UI components
├── lib/                          # Utility libraries
│   ├── auth.ts                   # Authentication utilities
│   ├── db.ts                     # Database connection
│   ├── email.ts                  # Email service
│   └── utils.ts                  # Helper functions
├── public/                       # Static assets
│   ├── downloads/                # Downloadable files
│   └── software/                 # Software installers
└── middleware.ts                 # Route protection
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.x or higher
- **npm** or **yarn**
- **MongoDB Atlas** account (or local MongoDB)
- **Python 3.x** (for POS app development)
- **Git**

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd billify
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory:

   ```env
   # MongoDB Connection
   MONGO_URL=*USE MONGODB URL*

   # JWT Secret (use a strong random string)
   JWT_SECRET=your_secret_key_here

   # Email Configuration (Gmail SMTP)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   SMTP_PORT=465
   SMTP_HOST=smtp.gmail.com
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Database Setup

### MongoDB Collections

The application uses the following collections:

- **users** - User accounts and authentication
- **billers** - Biller profiles and information
- **biller_keys** - Temporary access keys (3-minute expiration)
- **invoices** - Invoice records and transactions
- **items** - Product/service catalog
- **categories** - Product categories
- **staff** - Staff members
- **tables** - Table management (for restaurants)
- **offers** - Promotional offers

### Indexes

The application automatically creates necessary indexes:

- TTL index on `biller_keys.expiresAt` for automatic key expiration

## 🖥️ Desktop POS Application

### Setup

1. **Navigate to biller-app directory:**

   ```bash
   cd biller-app
   ```

2. **Create virtual environment:**

   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   source venv/bin/activate  # Mac/Linux
   ```

3. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Run from source:**
   ```bash
   python main.py
   ```

### Building the Executable

1. **Run the build script:**

   ```bash
   build.bat  # Windows
   ```

2. **Executable location:**

   ```
   biller-app/dist/Billify-POS.exe
   ```

3. **Deploy to web:**
   The build script automatically copies the executable to `public/downloads/`

### Troubleshooting POS

If you encounter authentication issues:

1. **Test database connection:**

   ```bash
   cd biller-app
   test-key.bat
   ```

2. **Check documentation:**
   - `biller-app/QUICK-START.md` - Quick fix guide
   - `biller-app/TROUBLESHOOTING.md` - Detailed diagnostics
   - `biller-app/FIX-SUMMARY.md` - Technical details

## 🔐 Authentication Flow

### Web Application

1. User signs up with email and password
2. Password is hashed with bcrypt
3. JWT token is created and stored in HTTP-only cookie
4. Middleware validates token on protected routes

### POS Application

1. User generates access key from web portal
2. Key is stored in MongoDB with 3-minute expiration
3. POS app verifies key against database
4. On success, user can access POS features

## 🎨 Tech Stack

### Frontend

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first CSS
- **Framer Motion** - Animations
- **Lucide React** - Icon library

### Backend

- **Next.js API Routes** - Serverless functions
- **MongoDB** - NoSQL database
- **Jose** - JWT handling
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service

### Desktop App

- **Python 3.x** - Programming language
- **CustomTkinter** - Modern GUI framework
- **PyMongo** - MongoDB driver
- **PyInstaller** - Executable builder

## 📝 API Routes

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout

### Dashboard

- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/invoices` - Invoice list
- `GET /api/dashboard/billers` - Biller list
- `POST /api/dashboard/biller-keys` - Generate access key
- `GET /api/dashboard/biller-keys` - Get active key

### Management

- `GET/POST /api/dashboard/manage/items` - Item management
- `GET/POST /api/dashboard/manage/categories` - Category management
- `GET/POST /api/dashboard/manage/staff` - Staff management
- `GET/POST /api/dashboard/manage/tables` - Table management
- `GET/POST /api/dashboard/manage/offers` - Offer management

### Contact

- `POST /api/contact` - Send contact form email

## 🔧 Configuration

### Email Setup (Gmail)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the generated password in `.env` as `EMAIL_PASS`

### MongoDB Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Add database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get connection string and add to `.env`

## 🚢 Deployment

### Web Application (Vercel)

1. **Push to GitHub:**

   ```bash
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Connect your GitHub repository
   - Add environment variables from `.env`
   - Deploy

### Alternative Platforms

- **Netlify** - Similar to Vercel
- **Railway** - Full-stack deployment
- **DigitalOcean** - VPS deployment

### Desktop Application

1. Build the executable:

   ```bash
   cd biller-app
   build.bat
   ```

2. The executable is automatically copied to `public/downloads/`

3. Users can download from the web portal

## 📊 Features Roadmap

- [ ] Multi-language support
- [ ] Advanced reporting and analytics
- [ ] Inventory management
- [ ] Customer relationship management (CRM)
- [ ] Mobile app (React Native)
- [ ] Payment gateway integration
- [ ] Receipt printing
- [ ] Barcode scanning
- [ ] Multi-location support
- [ ] Role-based access control

## 🐛 Known Issues

- Keys expire after 3 minutes (by design for security)
- POS app requires internet connection for authentication
- Email service limited to Gmail SMTP

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 👥 Support

For issues or questions:

- Check the documentation in `biller-app/` folder
- Run diagnostic tools (`test-key.bat`)
- Review troubleshooting guides

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB for the database platform
- CustomTkinter for the modern Python GUI
- All open-source contributors

---

**Built with ❤️ for modern businesses**
