require('dotenv').config();
const express = require('express');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { getUserById, addUser } = require('./databaseFunctions'); // Import addUser function
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport Google OAuth
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/callback'
},
async (token, tokenSecret, profile, done) => {
  // Find or create user
  const user = await getUserById(profile.id);
  if (user) {
    return done(null, user);
  } else {
    const newUser = {
      id: profile.id,
      displayName: profile.displayName,
      email: profile.emails[0].value,
      provider: 'google'
    };
    await addUser(newUser);
    return done(null, newUser);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id); // Store user ID in the session
});

passport.deserializeUser(async (id, done) => {
  const user = await getUserById(id);
  done(null, user);
});

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend/views'));

// Serve static files
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Routes
const apiRoutes = require('./routes/api');
const bookRouter = require('./routes/book');
const customizeRouter = require('./routes/customize');
const deliveryRoute = require('./routes/delivery');
const paymentRoute = require('./routes/payment');
const reviewRoute = require('./routes/review');
const checkoutRouter = require('./routes/checkout');
const confirmationRoute = require('./routes/confirmation');

app.use('/api', apiRoutes);
app.use('/', bookRouter);
app.use('/customize', customizeRouter);
app.use('/delivery', deliveryRoute);
app.use('/payment', paymentRoute);
app.use('/review', reviewRoute);
app.use('/checkout', checkoutRouter);
app.use('/confirmation', confirmationRoute);

app.get('/auth/logout', (req, res) => {
  req.logout(); // Provided by Passport.js
  res.redirect('/');
});


// Default route to render index.ejs
app.get('/', (req, res) => {
  res.render('index', { user: req.user });
});

// Google Auth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    req.session.userId = req.user.id;
    res.redirect('/home');
  });

app.get('/home', (req, res) => {
  res.render('home', { user: req.user });
});

app.get('/menu', (req, res) => {
  res.render('menu', { user: req.user });
});

app.get('/about', (req, res) => {
  res.render('about', { user: req.user });
});


app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
