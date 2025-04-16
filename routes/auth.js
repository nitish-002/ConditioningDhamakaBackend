const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const ApprovedEmail = require('../models/ApprovedEmail');
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }
    
    // Check if role is admin or rider, then verify if email is in approved list
    if (role && ['admin', 'rider'].includes(role)) {
      const approved = await ApprovedEmail.findOne({ email });
      if (!approved) {
        return res.status(403).json({
          success: false,
          message: `Email not approved for ${role} role`
        });
      }
    }
    
    // Create a user object without googleId field
    const userObj = {
      name,
      email,
      password,
      role: role || 'customer'
    };
    
    // Only set googleId if it's a Google OAuth registration
    // For manual registration, don't include the field at all
    
    // Create user
    const user = await User.create(userObj);
    
    // Auto login after registration
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error during login after registration'
        });
      }
      
      res.status(201).json({
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
});

// Login with email/password
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Authentication error'
      });
    }
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: info.message || 'Invalid credentials'
      });
    }
    
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Login error'
        });
      }
      
      res.json({
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          photo: user.photo
        }
      });
    });
  })(req, res, next);
});

// Google OAuth login
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'] 
}));

// Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/auth/login-failed',
    successRedirect: process.env.FRONTEND_URL || '/'
  })
);

// Login failed route
router.get('/login-failed', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'Login failed. Your email may not be in our approved list.'
  });
});

// Get current user
router.get('/me', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      authenticated: false,
      message: 'Not authenticated' 
    });
  }
  
  res.json({
    success: true,
    authenticated: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      photo: req.user.photo
    }
  });
});

// Logout
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

module.exports = router;
