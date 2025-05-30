# AI-Powered CRM

A modern, AI-powered Customer Relationship Management system built with Next.js, Express.js, and Supabase.

## 🚀 Features

- **Modern UI**: Clean, responsive interface built with Next.js and TailwindCSS
- **Contact Management**: Comprehensive contact tracking with search and filtering
- **Deal Pipeline**: Kanban-style deal management with customizable stages
- **Activity Tracking**: Log and track customer interactions (calls, emails, meetings, tasks)
- **Real-time Data**: Powered by Supabase for real-time updates
- **Authentication**: Secure authentication with multiple providers
- **API Documentation**: Comprehensive API documentation with Swagger
- **Testing**: Full test coverage for backend APIs
- **Sample Data**: Ready-to-use sample data for testing

## 🏗️ Architecture

```
AI-Powered-CRM/
├── frontend/          # Next.js frontend application
├── backend/           # Express.js API server
├── docs/             # Documentation
└── README.md         # This file
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**
- **Supabase Account** (for database and authentication)

## ⚙️ Environment Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd AI-Powered-CRM
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Set up authentication providers (optional):
   - Go to Authentication > Providers
   - Enable Google, Facebook, or other providers as needed

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `backend/.env` with your Supabase credentials:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Server Configuration
PORT=3001
NODE_ENV=development

# Sentry (Optional - for error logging)
SENTRY_DSN=your_sentry_dsn
```

### 4. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local
```

Edit `frontend/.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🗄️ Database Setup

### 1. Run Database Migrations

The database schema should be set up in your Supabase dashboard. The main tables include:

- `profiles` - User profiles
- `contacts` - Customer contacts
- `deals` - Sales opportunities
- `activities` - Customer interactions
- `pipelines` - Sales pipeline stages

### 2. Insert Sample Data (Optional)

To populate your database with sample data for testing:

```bash
cd backend
npm run sample-data:insert
```

To clear sample data:

```bash
npm run sample-data:clear
```

## 🏃‍♂️ Running the Application

### Option 1: Run Both Services Simultaneously

1. **Start the Backend Server**:
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:3001`

2. **Start the Frontend Development Server** (in a new terminal):
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:3000`

### Option 2: Using Process Managers (Recommended for Development)

You can use tools like `concurrently` to run both services:

```bash
# In the root directory
npm install -g concurrently

# Run both services
concurrently "cd backend && npm run dev" "cd frontend && npm run dev"
```

## 📱 Application Access

Once both services are running:

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/docs

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Frontend Tests (Coming Soon)

```bash
cd frontend

# Run component tests
npm test

# Run E2E tests
npm run test:e2e
```

## 📊 Sample Data

The application includes realistic sample data for testing:

- **8 Sample Contacts** with different statuses (lead, prospect, customer)
- **6 Sample Deals** across various pipeline stages
- **8 Sample Activities** including calls, emails, meetings, and tasks

## 🔧 Development Commands

### Backend Commands

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format

# Insert sample data
npm run sample-data:insert

# Clear sample data
npm run sample-data:clear
```

### Frontend Commands

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run type checking
npm run type-check
```

## 📖 API Documentation

The backend includes comprehensive API documentation available at:
- **Local Development**: http://localhost:3001/api/docs
- **Interactive Swagger UI** with all endpoints documented
- **Request/Response examples** for all API calls

## 🔐 Authentication

The application supports multiple authentication methods:

1. **Email/Password**: Traditional email-based authentication
2. **Google OAuth**: Sign in with Google account
3. **Facebook OAuth**: Sign in with Facebook account
4. **Other Providers**: Can be configured in Supabase

## 🌟 Key Features

### Contact Management
- Create, edit, and delete contacts
- Search and filter capabilities
- Contact status tracking (lead, prospect, customer)
- Company and role information

### Deal Pipeline
- Kanban-style deal management
- Customizable pipeline stages
- Deal value and probability tracking
- Timeline and close date management

### Activity Tracking
- Log various activity types (calls, emails, meetings, tasks)
- Activity status and outcome tracking
- Link activities to contacts and deals
- Comprehensive activity history

### Dashboard
- Overview of key metrics
- Recent activity feed
- Upcoming tasks
- Quick action buttons

## 🚀 Deployment

### Backend Deployment (Railway/Render)

1. Create account on Railway or Render
2. Connect your Git repository
3. Set environment variables
4. Deploy automatically from main branch

### Frontend Deployment (Vercel)

1. Create account on Vercel
2. Import your Git repository
3. Set environment variables
4. Deploy automatically from main branch

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify Supabase URL and keys are correct
   - Check that RLS policies are properly configured

2. **Authentication Problems**
   - Ensure redirect URLs are configured in Supabase
   - Verify authentication provider settings

3. **API Connection Issues**
   - Check that backend is running on port 3001
   - Verify CORS settings for frontend domain

4. **Build Errors**
   - Clear node_modules and reinstall dependencies
   - Check for TypeScript errors

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the API documentation
3. Check existing issues in the repository
4. Create a new issue with detailed information

---

**Happy CRM-ing! 🎉**