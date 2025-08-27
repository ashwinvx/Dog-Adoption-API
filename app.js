const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const corsMiddleware = require('./cors');

const app = express();
app.options('/*splat', corsMiddleware);
app.use(corsMiddleware);

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

//database connection
const dbURI = 'mongodb+srv://ash:test1234@cluster0.jvcbvxj.mongodb.net/node-auth';
mongoose.connect(dbURI)
    .then(result => app.listen(3000))
    .catch(err => console.log(err));

//routes
app.get('/{*any}', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);

