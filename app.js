const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const dogRoutes = require('./routes/dogRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middlewares/authMiddleware');
const corsMiddleware = require('./cors');
const limiter = require('./middlewares/ratelimitMiddleware');
const dotenv = require('dotenv').config();
const ExpressError = require('./middlewares/expressError');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(limiter);
app.options('/*splat', corsMiddleware);
app.use(corsMiddleware);

// view engine
app.set('view engine', 'ejs');

//database connection
const dbURI = process.env.MONGODB_URI;
mongoose.connect(dbURI)
    .then(result => app.listen(3000))
    .catch(err => console.log(err));

//routes
app.get('/{*any}', checkUser);
app.get('/', (req, res) => res.render('home'));
app.use(authRoutes);
app.use(checkUser, requireAuth, dogRoutes);

/** general error handler */

app.use(function (req, res, next) {
    const err = new ExpressError("Page Not Found", 404);
    return next(err);
});

/** general error handler */

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    return res.json({
        error: err,
        message: err.message
    });
});
