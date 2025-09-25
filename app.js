const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const dogRoutes = require('./routes/dogRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middlewares/authMiddleware');
const corsMiddleware = require('./cors');
const limiter = require('./middlewares/ratelimitMiddleware');
const ExpressError = require('./middlewares/expressError');

const app = express();

//load configuration from .env file
require('dotenv-flow').config();

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
    .then(result => app.listen(process.env.PORT))
    .catch(err => console.log(err));

//routes
app.get('/{*any}', checkUser);
app.get('/', (req, res) => res.status(200).render('home'));
app.use("/api/user", checkUser, authRoutes);
app.use("/api/dogs", checkUser, requireAuth, dogRoutes);

/** general error handler */

app.use(function (req, res) {
    res.status(404).render('404', { title: '404' });
});

module.exports = app;