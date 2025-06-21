# Too-A-Tee Backend Server

This is the backend server for the Too-A-Tee T-shirt creator app, built with Node.js, Express, and Firebase.

## Features

- 🔐 **Firebase Authentication** - Secure user authentication and authorization
- 📁 **Firebase Firestore** - NoSQL database for user data, designs, and orders
- 🖼️ **Firebase Storage** - Image upload and management
- 🛡️ **Security Middleware** - Rate limiting, CORS, and input validation
- 📊 **User Management** - Profile management and preferences
- 🎨 **Design Management** - Create, update, and manage T-shirt designs
- 🛒 **Order Processing** - Order management with Stripe integration (pending)
- 🔍 **Search & Discovery** - Design search and public gallery

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project with Firestore and Storage enabled
- Firebase service account key

## Installation

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the server directory with the following variables:

   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=5000
   CLIENT_URL=http://localhost:19006

   # Firebase Configuration
   FIREBASE_TYPE=service_account
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY_ID=your-private-key-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=your-service-account-email@your-project.iam.gserviceaccount.com
   FIREBASE_CLIENT_ID=your-client-id
   FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
   FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
   FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
   FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your-service-account-email%40your-project.iam.gserviceaccount.com
   FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com

   # Stripe Configuration (for future implementation)
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100

   # File Upload Limits
   MAX_FILE_SIZE=10485760
   MAX_FILES_PER_UPLOAD=10

   # CORS Configuration
   ALLOWED_ORIGINS=http://localhost:19006,http://localhost:3000,https://yourdomain.com
   ```

3. **Firebase Setup:**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Enable Storage
   - Create a service account and download the JSON key
   - Update the environment variables with your Firebase credentials

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in your .env file).

## API Endpoints

### Authentication
- `POST /api/auth/create-profile` - Create user profile after Firebase auth
- `GET /api/auth/me` - Get current user info
- `GET /api/auth/verify-email` - Check email verification status
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh-token` - Refresh authentication token

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/preferences` - Update user preferences
- `GET /api/users/designs` - Get user's designs
- `GET /api/users/orders` - Get user's orders
- `DELETE /api/users/account` - Delete user account

### Designs
- `POST /api/designs` - Create new design
- `GET /api/designs/:designId` - Get design by ID
- `PUT /api/designs/:designId` - Update design
- `DELETE /api/designs/:designId` - Delete design
- `GET /api/designs/user/my-designs` - Get user's designs
- `GET /api/designs/public/featured` - Get public designs
- `GET /api/designs/search` - Search designs
- `POST /api/designs/:designId/like` - Like/unlike design
- `POST /api/designs/:designId/duplicate` - Duplicate design
- `GET /api/designs/categories` - Get design categories

### Images
- `POST /api/images/upload` - Upload single image
- `POST /api/images/upload-multiple` - Upload multiple images
- `POST /api/images/design` - Upload design image
- `POST /api/images/avatar` - Upload user avatar
- `DELETE /api/images/:fileName` - Delete image
- `GET /api/images/metadata/:fileName` - Get image metadata
- `POST /api/images/signed-url` - Generate signed URL
- `GET /api/images/my-images` - List user's images

### Orders (Stripe integration pending)
- `POST /api/orders` - Create new order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:orderId` - Get order by ID
- `POST /api/orders/:orderId/cancel` - Cancel order
- `POST /api/orders/create-payment-intent` - Create Stripe payment intent

## Project Structure

```
server/
├── config/
│   └── firebase.js          # Firebase configuration
├── controllers/             # Route controllers (future)
├── middleware/
│   └── auth.js             # Authentication middleware
├── models/
│   ├── User.js             # User data model
│   └── Design.js           # Design data model
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── users.js            # User management routes
│   ├── designs.js          # Design management routes
│   ├── images.js           # Image upload routes
│   └── orders.js           # Order management routes
├── services/
│   └── imageService.js     # Image upload service
├── utils/                  # Utility functions (future)
├── package.json
├── server.js               # Main server file
└── README.md
```

## Security Features

- **Rate Limiting** - Prevents abuse with configurable limits
- **CORS Protection** - Configurable cross-origin resource sharing
- **Input Validation** - All inputs validated using express-validator
- **Authentication** - Firebase JWT token verification
- **File Upload Security** - File type and size validation
- **Helmet** - Security headers middleware

## Firebase Collections

The app uses the following Firestore collections:

- `users` - User profiles and preferences
- `designs` - T-shirt designs
- `design_likes` - Design likes tracking
- `orders` - User orders (future)
- `categories` - Design categories

## Image Storage

Images are stored in Firebase Storage with the following structure:

- `uploads/{userId}/` - General user uploads
- `designs/{userId}/{designId}/` - Design-specific images
- `avatars/{userId}/` - User profile pictures

## Development

### Adding New Routes

1. Create a new route file in `routes/`
2. Add the route to `server.js`
3. Implement proper validation and error handling

### Adding New Models

1. Create a new model file in `models/`
2. Use the Firebase configuration for database operations
3. Implement proper error handling

### Testing

```bash
npm test
```

## Deployment

### Environment Variables
Make sure to set all required environment variables in your production environment.

### Firebase Rules
Update your Firestore and Storage security rules for production use.

### CORS Configuration
Update the `ALLOWED_ORIGINS` environment variable with your production domain.

## Future Enhancements

- [ ] Stripe payment integration
- [ ] Email notifications
- [ ] Advanced search with Algolia
- [ ] Image optimization and compression
- [ ] Webhook support
- [ ] Analytics tracking
- [ ] Admin dashboard
- [ ] Bulk operations
- [ ] Caching layer
- [ ] API documentation with Swagger

## Support

For issues and questions, please refer to the main project documentation or create an issue in the repository. 