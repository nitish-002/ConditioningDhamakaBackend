const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const ApprovedEmail = require('../models/ApprovedEmail');

// Local Strategy for email/password login
passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        // Find user by email with password
        const user = await User.findOne({ email }).select('+password');
        
        // No user found
        if (!user) {
          return done(null, false, { message: 'Invalid credentials' });
        }
        
        // Check if password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
          return done(null, false, { message: 'Invalid credentials' });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Extract email from Google profile
      const email = profile.emails[0].value;
      
      // Check if email is in approved list
      const approvedEmail = await ApprovedEmail.findOne({ email });
      if (!approvedEmail) {
        return done(null, false, { message: 'Email not approved for access' });
      }
      
      // Check if user already exists
      let user = await User.findOne({ googleId: profile.id });
      
      if (user) {
        return done(null, user);
      }
      
      // Create new user
      user = await User.create({
        name: profile.displayName,
        email: email,
        googleId: profile.id,
        photo: profile.photos[0].value,
        role: 'customer' // Default role
      });
      
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// Serialize user into session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
