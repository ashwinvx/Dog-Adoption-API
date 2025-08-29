const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const dogRoutes = require('./routes/dogRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middlewares/authMiddleware');
const corsMiddleware = require('./cors');
const limiter = require('./middlewares/ratelimitMiddleware');
const dotenv = require('dotenv').config();

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
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);
app.use(checkUser, dogRoutes);

