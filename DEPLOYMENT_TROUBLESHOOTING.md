# Deployment Troubleshooting Guide

## Common Issues and Solutions

### 1. Session/Cookie Issues in Production

The main issue you're experiencing is likely related to session management in production. Here are the key fixes implemented:

#### Backend Changes Made:
1. **Added trust proxy**: `app.set('trust proxy', 1)` - Required for Render and other cloud platforms
2. **Improved CORS configuration**: More flexible origin handling with better debugging
3. **Enhanced session configuration**: Better cookie settings for production
4. **Added debugging logs**: To help identify session issues

#### Frontend Requirements:
Make sure your frontend is configured to send credentials with requests:

```javascript
// For fetch API
fetch('https://conditioningdhamakabackend.onrender.com/auth/me', {
  method: 'GET',
  credentials: 'include', // This is crucial!
  headers: {
    'Content-Type': 'application/json'
  }
});

// For axios
axios.defaults.withCredentials = true;
// or for individual requests:
axios.get('/auth/me', { withCredentials: true });
```

### 2. Environment Variables for Production

Make sure these environment variables are set in your Render deployment:

```
NODE_ENV=production
MONGO_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=a_strong_random_secret_for_production
FRONTEND_DEV_URL=http://localhost:5173
FRONTEND_PROD_URL=https://acarea.netlify.app
```

### 3. Google OAuth Configuration

If using Google OAuth, make sure the redirect URL in your Google Console includes:
- `https://conditioningdhamakabackend.onrender.com/auth/google/callback`

### 4. Testing the Fix

1. **Test the health endpoint first**:
   ```bash
   curl https://conditioningdhamakabackend.onrender.com/health
   ```

2. **Test the auth test endpoint**:
   ```bash
   curl https://conditioningdhamakabackend.onrender.com/auth/test
   ```

3. **Test login flow**:
   ```bash
   # Login first (save cookies)
   curl -c cookies.txt -X POST https://conditioningdhamakabackend.onrender.com/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"your_email","password":"your_password"}'
   
   # Then test /auth/me (using saved cookies)
   curl -b cookies.txt https://conditioningdhamakabackend.onrender.com/auth/me
   ```

### 5. Frontend Code Example

Make sure your frontend login function looks like this:

```javascript
// Login function
const login = async (email, password) => {
  try {
    const response = await fetch('https://conditioningdhamakabackend.onrender.com/auth/login', {
      method: 'POST',
      credentials: 'include', // Important!
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Login error:', error);
  }
};

// Check authentication function
const checkAuth = async () => {
  try {
    const response = await fetch('https://conditioningdhamakabackend.onrender.com/auth/me', {
      method: 'GET',
      credentials: 'include', // Important!
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Auth check error:', error);
  }
};
```

### 6. Debug Steps

1. Open browser developer tools
2. Go to Application/Storage tab
3. Check if cookies are being set after login
4. Look for a cookie named `sessionId` from your backend domain
5. Check the Network tab to see if cookies are being sent with requests

### 7. Common Pitfalls

- **Missing `credentials: 'include'`** in frontend requests
- **Incorrect CORS configuration** not allowing credentials
- **Session secret not set** in production environment variables
- **Trust proxy not configured** for cloud deployment
- **Frontend URL not matching** CORS allowed origins

### 8. If Still Not Working

Add this debugging code to your frontend to see what's happening:

```javascript
// Add this to your frontend to debug
const debugAuth = async () => {
  try {
    console.log('Testing backend connection...');
    
    // Test basic connection
    const healthResponse = await fetch('https://conditioningdhamakabackend.onrender.com/health');
    console.log('Health check:', await healthResponse.json());
    
    // Test auth endpoint
    const authTestResponse = await fetch('https://conditioningdhamakabackend.onrender.com/auth/test', {
      credentials: 'include'
    });
    console.log('Auth test:', await authTestResponse.json());
    
    // Test /auth/me
    const meResponse = await fetch('https://conditioningdhamakabackend.onrender.com/auth/me', {
      credentials: 'include'
    });
    console.log('Auth me status:', meResponse.status);
    console.log('Auth me response:', await meResponse.json());
    
  } catch (error) {
    console.error('Debug error:', error);
  }
};

// Call this function to debug
debugAuth();
```
