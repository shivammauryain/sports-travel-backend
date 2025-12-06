# Sports Travel - Backend API

A robust RESTful API built with Express.js and MongoDB for managing sports travel bookings, events, packages, and customer relationships. This backend powers the Sports Travel platform with comprehensive admin controls and real-time analytics.

## 🌐 Live API

**API Base URL**: [https://sports-travel-backend.vercel.app](https://sports-travel-backend.vercel.app)

**Frontend Application**: [https://travel-gamma-ruby-17.vercel.app](https://travel-gamma-ruby-17.vercel.app)

### Demo Admin Credentials
For testing the API with authentication:

```json
{
  "email": "admin@sportstravel.com",
  "password": "Admin@123"
}
```

**Login Endpoint**: `POST /api/auth/login`

> **Note**: These are demo credentials for testing purposes only.

## Features

- **Authentication & Authorization**: JWT-based secure authentication with role-based access control
- **Lead Management**: Comprehensive system for tracking customer inquiries and bookings
- **Event Management**: Create and manage sports events with locations, dates, and details
- **Package Management**: Flexible pricing tiers (Economy, Basic, Standard, Premium) with dynamic pricing
- **Quote Generation**: Automated quote calculation with email notifications
- **Dashboard Analytics**: Real-time statistics for revenue, leads, and quotes
- **Email Notifications**: Automated emails for quote generation using Nodemailer
- **Rate Limiting**: Protection against API abuse with request throttling
- **Error Handling**: Centralized error handling with detailed logging
- **Database Optimization**: Connection pooling for serverless environments

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer with Gmail SMTP
- **Security**: Helmet, CORS, bcrypt for password hashing
- **Rate Limiting**: express-rate-limit
- **Deployment**: Vercel Serverless Functions

## Getting Started

### Prerequisites
- Node.js 18.x or 20.x
- MongoDB Atlas account or local MongoDB installation
- Gmail account for email notifications (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/shivammauryain/sports-travel-backend.git
cd sports-travel-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string
MONGODB_URI_TEST=your_test_db_connection_string

# Authentication
JWT_SECRET=your_super_secret_jwt_key

# CORS
ORIGIN_URL=http://localhost:3000,https://travel-gamma-ruby-17.vercel.app/

# Email Configuration (Optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
RECEIVER_EMAIL=your-email@gmail.com
```

4. Run the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests with Jest
- `npm run seed` - Seed database with sample data
- `npm run create-admin` - Create admin user
- `npm run check-setup` - Verify environment setup

## API Endpoints

### Health Check
```
GET /api/health - Check API status
```

### Authentication
```
POST /api/auth/register - Register new admin user
POST /api/auth/login - Login and get JWT token
POST /api/auth/logout - Logout (requires auth)
GET /api/auth/me - Get current user (requires auth)
```

### Leads
```
GET /api/leads - Get all leads (requires auth)
POST /api/leads - Create new lead
GET /api/leads/:id - Get lead by ID (requires auth)
PUT /api/leads/:id - Update lead (requires auth)
DELETE /api/leads/:id - Delete lead (requires auth)
PATCH /api/leads/:id/status - Update lead status (requires auth)
```

### Events
```
GET /api/events - Get all events
POST /api/events - Create event (requires auth)
GET /api/events/:id - Get event by ID
PUT /api/events/:id - Update event (requires auth)
DELETE /api/events/:id - Delete event (requires auth)
```

### Packages
```
GET /api/packages - Get all packages
POST /api/packages - Create package (requires auth)
GET /api/packages/:id - Get package by ID
PUT /api/packages/:id - Update package (requires auth)
DELETE /api/packages/:id - Delete package (requires auth)
GET /api/packages/event/:eventId - Get packages by event
```

### Quotes
```
GET /api/quotes - Get all quotes (requires auth)
POST /api/quotes - Generate quote (sends email)
GET /api/quotes/:id - Get quote by ID (requires auth)
PUT /api/quotes/:id - Update quote (requires auth)
DELETE /api/quotes/:id - Delete quote (requires auth)
```

### Dashboard
```
GET /api/dashboard/stats - Get dashboard statistics (requires auth)
GET /api/dashboard/leads/recent - Get recent leads (requires auth)
GET /api/dashboard/quotes/recent - Get recent quotes (requires auth)
GET /api/dashboard/revenue - Get revenue data (requires auth)
```

## Project Structure

```
server/
├── api/
│   └── index.js              # Vercel serverless entry point
├── src/
│   ├── index.js              # Express app initialization
│   ├── config/
│   │   ├── database.js       # MongoDB connection
│   │   └── env.js            # Environment configuration
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── eventController.js
│   │   ├── leadController.js
│   │   ├── packageController.js
│   │   └── quoteController.js
│   ├── middleware/
│   │   ├── auth.js           # JWT authentication
│   │   ├── errorHandler.js   # Error handling
│   │   ├── logger.js         # Request logging
│   │   ├── rateLimiter.js    # Rate limiting
│   │   └── requestId.js      # Request ID tracking
│   ├── models/
│   │   ├── Event.js
│   │   ├── Lead.js
│   │   ├── Package.js
│   │   ├── Quote.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── events.js
│   │   ├── leads.js
│   │   ├── packages.js
│   │   └── quotes.js
│   └── utils/
│       ├── email.js          # Email service
│       ├── pricing.js        # Pricing calculations
│       ├── response.js       # Response formatting
│       └── validators.js     # Input validation
├── .env                      # Environment variables
├── vercel.json              # Vercel configuration
└── package.json
```

## Database Models

### User
- Admin authentication and profile management
- Password hashing with bcrypt
- Active/inactive status

### Event
- Sports event details
- Location and date information
- Slug for URL-friendly names

### Package
- Travel package configurations
- Tier-based pricing (Economy, Basic, Standard, Premium)
- Features and inclusions
- Event association

### Lead
- Customer inquiry tracking
- Status management (New, Contacted, Quoted, Won, Lost)
- Package and event association
- Travel details

### Quote
- Automated pricing calculations
- Email delivery tracking
- Validity period management

## Authentication

The API uses JWT tokens for authentication:

1. **Register/Login**: Receive JWT token
2. **Include Token**: Add to Authorization header: `Bearer <token>`
3. **Protected Routes**: Automatically validated
4. **Token Expiry**: 7 days by default

## Email Service

Automated email notifications using Nodemailer:

- Quote generation emails with pricing breakdown
- HTML and plain text formats
- Indian Rupee (₹) formatting
- Configurable SMTP settings

## Rate Limiting

- **Global Limit**: 100 requests per 15 minutes per IP
- **Lead Creation**: 5 submissions per 15 minutes per IP
- Prevents spam and abuse

## Error Handling

Centralized error handling with:

- Structured error responses
- Request ID tracking
- Environment-based stack traces
- Comprehensive logging

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables in Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:

- `MONGODB_URI`
- `JWT_SECRET`
- `ORIGIN_URL`
- `EMAIL_USER`
- `EMAIL_PASS`
- `RECEIVER_EMAIL`

## Security Best Practices

- ✅ Helmet.js for security headers
- ✅ CORS configuration
- ✅ Password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ Rate limiting
- ✅ Input validation
- ✅ Environment variable protection
- ✅ MongoDB injection prevention

## Testing

Run tests with:
```bash
npm test
```

Currently includes:
- API endpoint tests
- Pricing calculation tests

## CI/CD

GitHub Actions workflow for:
- Automated testing on push
- Linting and syntax checking
- Coverage reports
- Multi-version Node.js testing (18.x, 20.x)

## Performance Optimization

- **Connection Pooling**: Efficient MongoDB connections for serverless
- **Serverless-Optimized**: Designed for Vercel Functions
- **Caching**: Strategic database query optimization
- **Lean Queries**: Select only necessary fields

## Monitoring & Logging

- Request ID tracking
- Timestamp logging
- Error stack traces (development only)
- MongoDB connection status

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## API Documentation

For detailed API documentation, import the Postman collection from `public/Sports-Travel-API.postman_collection.json`

## Troubleshooting

### Database Connection Issues
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure network connectivity

### Email Not Sending
- Verify Gmail credentials
- Enable "Less secure app access" or use App Passwords
- Check SMTP configuration

### Authentication Errors
- Ensure JWT_SECRET is set
- Check token expiry
- Verify user credentials

## License

This project is licensed under the ISC License.

## Author

**Shivam Maurya**

## Support
- GitHub: [shivammauryain](https://github.com/shivammauryain)
- Email: resultguru247@gmail.com

## Acknowledgments

- Express.js community
- MongoDB team
- Vercel for serverless hosting
- All open-source contributors
