# Firebase Implementation Guide

This document outlines the complete Firebase implementation for the Too-A-Tee React Native app, including Firestore database, Authentication, and Storage.

## 🚀 Features Implemented

- ✅ **Firebase Authentication** - Email/password with AsyncStorage persistence
- ✅ **Firestore Database** - Real-time data with CRUD operations
- ✅ **Firebase Storage** - File upload and management
- ✅ **Redux Integration** - State management with async thunks
- ✅ **React Hooks** - Custom hooks for real-time data
- ✅ **Error Handling** - Comprehensive error management
- ✅ **Offline Support** - Network status management
- ✅ **Data Validation** - Input sanitization and validation

## 📁 File Structure

```
src/
├── config/
│   └── firebase.js              # Firebase initialization
├── services/
│   ├── authService.js           # Authentication operations
│   └── firestoreService.js      # Firestore CRUD operations
├── hooks/
│   └── useFirestore.js          # Custom React hooks
├── store/
│   ├── index.js                 # Redux store configuration
│   └── slices/
│       └── firestoreSlice.js    # Redux slice for Firestore
└── components/
    └── FirestoreExample.js      # Example component usage
```

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install firebase@^9.23.0 @react-native-async-storage/async-storage react-firebase-hooks
```

### 2. Firebase Configuration

The Firebase configuration is already set up in `app.json`:

```json
{
  "expo": {
    "extra": {
      "firebaseApiKey": "your-api-key",
      "firebaseAuthDomain": "your-project.firebaseapp.com",
      "firebaseProjectId": "your-project-id",
      "firebaseStorageBucket": "your-project.appspot.com",
      "firebaseMessagingSenderId": "your-sender-id",
      "firebaseAppId": "your-app-id",
      "firebaseMeasurementId": "your-measurement-id"
    }
  }
}
```

### 3. Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Authentication with Email/Password
4. Create Firestore Database
5. Set up Storage bucket
6. Configure security rules

## 🗄️ Database Schema

### Collections Structure

```javascript
// Users Collection
users/{uid} {
  uid: string,
  email: string,
  displayName: string,
  photoURL: string,
  createdAt: timestamp,
  updatedAt: timestamp,
  isActive: boolean,
  role: string,
  profile: {
    bio: string,
    location: string,
    website: string,
    socialLinks: object
  },
  stats: {
    designsCreated: number,
    designsSold: number,
    totalEarnings: number,
    followers: number,
    following: number
  }
}

// Designs Collection
designs/{designId} {
  creatorId: string,
  title: string,
  description: string,
  imageUrl: string,
  price: number,
  isPublic: boolean,
  isActive: boolean,
  category: string,
  tags: array,
  createdAt: timestamp,
  updatedAt: timestamp,
  stats: {
    views: number,
    likes: number,
    shares: number,
    purchases: number
  }
}

// Orders Collection
orders/{orderId} {
  buyerId: string,
  sellerId: string,
  designId: string,
  status: string,
  paymentStatus: string,
  total: number,
  items: array,
  shippingAddress: object,
  trackingInfo: object,
  createdAt: timestamp,
  updatedAt: timestamp
}

// Favorites Collection
favorites/{favoriteId} {
  userId: string,
  designId: string,
  createdAt: timestamp
}
```

## 🔐 Security Rules

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public designs can be read by anyone, created/updated by owner
    match /designs/{designId} {
      allow read: if resource.data.isPublic == true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        request.auth.uid == resource.data.creatorId;
    }
    
    // Orders can be read/written by buyer or seller
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.buyerId || 
         request.auth.uid == resource.data.sellerId);
    }
    
    // Favorites can be read/written by the user
    match /favorites/{favoriteId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

## 🎣 Usage Examples

### Using Custom Hooks

```javascript
import { useCurrentUser, useDesigns, useUserOrders } from '../hooks/useFirestore';

const MyComponent = () => {
  // Get current user with real-time updates
  const { user, loading: userLoading } = useCurrentUser();
  
  // Get public designs with pagination
  const { designs, loading, hasMore, loadMore } = useDesigns({ 
    isPublic: true 
  });
  
  // Get user orders
  const { orders } = useUserOrders(user?.uid);
  
  return (
    // Your component JSX
  );
};
```

### Using Redux Actions

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { 
  createNewDesign, 
  fetchDesigns, 
  addDesignToFavorites 
} from '../store/slices/firestoreSlice';

const MyComponent = () => {
  const dispatch = useDispatch();
  const { designs, loading } = useSelector(state => state.firestore);
  
  const handleCreateDesign = async () => {
    try {
      const designData = {
        title: 'My Design',
        description: 'Description',
        price: 9.99,
        isPublic: true
      };
      
      await dispatch(createNewDesign({ 
        designData, 
        userId: user.uid 
      })).unwrap();
      
      // Success handling
    } catch (error) {
      // Error handling
    }
  };
  
  return (
    // Your component JSX
  );
};
```

### Using Service Functions Directly

```javascript
import { 
  createDesign, 
  getDesigns, 
  subscribeToDesigns 
} from '../services/firestoreService';

// Create a design
const createNewDesign = async () => {
  const result = await createDesign(designData, userId);
  if (result.success) {
    console.log('Design created:', result.data);
  }
};

// Get designs with filters
const fetchDesigns = async () => {
  const result = await getDesigns({ 
    isPublic: true, 
    category: 't-shirts' 
  });
  if (result.success) {
    console.log('Designs:', result.data.designs);
  }
};

// Subscribe to real-time updates
const unsubscribe = subscribeToDesigns(
  { creatorId: userId }, 
  (designs) => {
    console.log('Real-time designs:', designs);
  }
);
```

## 🔄 Real-time Features

### Automatic User Profile Creation

When a user registers, their profile is automatically created in Firestore:

```javascript
// In authService.js - after successful registration
const userData = {
  uid: user.uid,
  email: user.email,
  displayName: user.displayName || user.email,
  photoURL: user.photoURL || '',
  // ... other fields
};

await createUser(userData);
```

### Real-time Data Listening

The app automatically listens for real-time updates:

```javascript
// User data updates
subscribeToUser(uid, (userData) => {
  // Update Redux state
  dispatch(setUserData({ uid, userData }));
});

// Designs updates
subscribeToDesigns(filters, (designs) => {
  // Update Redux state
  dispatch(setDesignsList(designs));
});
```

## 🛡️ Error Handling

### Service Level Error Handling

All service functions return consistent error responses:

```javascript
// Success response
{ success: true, data: result }

// Error response
{ success: false, error: 'Error message', code: 'ERROR_CODE' }
```

### Component Level Error Handling

```javascript
const { error, handleError, clearError } = useFirestoreError();

useEffect(() => {
  if (error) {
    Alert.alert('Error', error);
    clearError();
  }
}, [error]);
```

### Redux Error Handling

```javascript
const { errors } = useSelector(state => state.firestore);

if (errors.designs) {
  // Handle design errors
}
```

## 📱 Offline Support

### Network Status Management

```javascript
import { enableFirestoreNetwork, disableFirestoreNetwork } from '../config/firebase';

// Disable network for offline mode
disableFirestoreNetwork();

// Re-enable network
enableFirestoreNetwork();
```

### Offline Data Persistence

Firestore automatically caches data for offline access. Users can:
- View previously loaded data
- Queue writes for when connection is restored
- Continue using the app offline

## 🚀 Performance Optimization

### Pagination

```javascript
const { designs, hasMore, loadMore } = useDesigns({ 
  isPublic: true 
}, 20); // 20 items per page

// Load more when user scrolls to bottom
<FlatList
  onEndReached={loadMore}
  onEndReachedThreshold={0.1}
/>
```

### Efficient Queries

```javascript
// Use indexes for complex queries
const q = query(
  collection(db, 'designs'),
  where('isPublic', '==', true),
  where('category', '==', 't-shirts'),
  orderBy('createdAt', 'desc'),
  limit(20)
);
```

### Batch Operations

```javascript
import { batchUpdateDesigns } from '../services/firestoreService';

const updates = [
  { designId: '1', updates: { price: 15.99 } },
  { designId: '2', updates: { isActive: false } }
];

await batchUpdateDesigns(updates);
```

## 🔒 Security Best Practices

1. **Always validate user authentication**
2. **Use security rules to restrict access**
3. **Sanitize user inputs**
4. **Implement rate limiting**
5. **Monitor usage and costs**
6. **Regular security audits**

## 📊 Monitoring and Analytics

### Firebase Analytics

```javascript
import { getAnalytics, logEvent } from 'firebase/analytics';

const analytics = getAnalytics(app);

// Track custom events
logEvent(analytics, 'design_created', {
  design_id: designId,
  category: category,
  price: price
});
```

### Error Monitoring

```javascript
import { getPerformance } from 'firebase/performance';

const perf = getPerformance(app);

// Monitor performance
const trace = perf.trace('design_creation');
trace.start();
// ... design creation logic
trace.stop();
```

## 🧪 Testing

### Unit Tests

```javascript
import { createDesign, getUser } from '../services/firestoreService';

describe('Firestore Service', () => {
  test('should create design successfully', async () => {
    const designData = { title: 'Test Design' };
    const result = await createDesign(designData, 'test-user-id');
    expect(result.success).toBe(true);
  });
});
```

### Integration Tests

```javascript
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import FirestoreExample from '../components/FirestoreExample';

test('should create design when form is submitted', async () => {
  const { getByPlaceholderText, getByText } = render(<FirestoreExample />);
  
  fireEvent.changeText(getByPlaceholderText('Design Title'), 'Test Design');
  fireEvent.press(getByText('Create Design'));
  
  await waitFor(() => {
    expect(getByText('Design created successfully!')).toBeTruthy();
  });
});
```

## 📈 Cost Optimization

1. **Use pagination to limit reads**
2. **Implement efficient queries with indexes**
3. **Cache frequently accessed data**
4. **Monitor usage in Firebase Console**
5. **Set up billing alerts**

## 🚀 Deployment Checklist

- [ ] Firebase project configured
- [ ] Security rules implemented
- [ ] Authentication enabled
- [ ] Firestore database created
- [ ] Storage bucket configured
- [ ] Environment variables set
- [ ] Error handling implemented
- [ ] Offline support tested
- [ ] Performance optimized
- [ ] Security tested
- [ ] Monitoring configured

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [React Native Firebase](https://rnfirebase.io/)
- [Firebase Performance](https://firebase.google.com/docs/perf-mon)

---

This implementation provides a robust, scalable, and secure Firebase backend for your React Native app with real-time capabilities, offline support, and comprehensive error handling. 