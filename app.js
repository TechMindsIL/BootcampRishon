// Load environment variables from .env file
require('dotenv').config();

// Import required modules
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session'); // Import express-session
const MongoStore = require('connect-mongo'); // Import connect-mongo
const mongoose = require('mongoose');

// Initialize Express application
const app = express();

// Set the view engine to EJS for rendering HTML templates
app.set('view engine', 'ejs');

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse cookies
app.use(cookieParser());
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: false }));
// Middleware to serve static files from the 'public' directory
app.use(express.static('public'));
// Configure session middleware
app.use(session({
    secret: process.env.SESSION_SECRET, // Secret key for signing the session ID cookie
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGOURL,
        collectionName: 'sessions' // Collection to store sessions
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        secure: process.env.HTTP_ONLY === "true", // Set to true if using HTTPS
        httpOnly: process.env.HTTP_ONLY === "true" // Prevents client-side JavaScript from accessing the cookie
    }
}));

// MongoDB connection setup
mongoose.connect(process.env.MONGOURL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('DB connection is open'));
db.set("useCreateIndex", true);
console.log(process.env.MONGOURL);

// import upload route, define it as a static route that serves files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Import and use routes
app.use('/', require('./routes/index'));
app.use('/templates', require('./routes/templates'));
app.use('/api/v1/routes', require('./routes/api/v1/route'));
app.use('/api/v1/auth', require('./routes/api/v1/auth'));
app.use('/api/v1/users', require('./routes/api/v1/user'));
app.use('/api/v1/tags', require('./routes/api/v1/tag'));
app.use('/api/v1/places', require('./routes/api/v1/place'));
app.use('/api/v1/categories', require('./routes/api/v1/category'));
app.use('/api/v1/savedRoutes', require('./routes/api/v1/savedRoutes'));

app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'An internal server error occurred' });
});

// Start the server and listen on port specified in the environment variable (.env file)
app.listen(process.env.PORT, () => {
    console.log('Server is running on port ' + process.env.PORT);
});