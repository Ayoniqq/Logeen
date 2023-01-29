const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path');

const dbUrlLocal = 'mongodb://127.0.0.1:27017/logeen';
const session = require('express-session');
const MongoStore = require('connect-mongo');

const passport = require('passport');
const passportLocal = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');

app.set('view engine', 'ejs'); //EJS
app.set('views', path.join(__dirname, 'views')); //EJS

app.use(express.urlencoded({ extended: true })); //BODY PARSER FOR FORMS(req.body) 

app.use(session({
    secret: 'mySecret',
    store: MongoStore.create({ mongoUrl: dbUrlLocal }),
    resave: true,
    saveUninitialized: false
}));

//FOR PASSPORT SESSION
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* ---------------<--MONGO DB CONNECTION -->-------------------------*/

const mongoose = require('mongoose');
mongoose.set('strictQuery', true); //Ensure this code comes before Mongoose connection below

//mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp') //, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connect(dbUrlLocal)
    .then(() => {
        console.log("MONGO DB CONNECTION OPEN");
    })
    .catch((err) => {
        console.log("OH NO: MONGO DB ENCOUNTERED ERROR:");
        console.log(err);
    })

/* ---------------<--MONGO DB CONNECTION -->-------------------------*/



app.get('/', (req, res) => {
    res.render('home');
});

/* LOGIN */
app.get('/login', (req,res) => {
    res.render('login');   
})
app.post('/login', (req,res) => {
    console.log(req.body)
    res.redirect('/');
})
/* /LOGIN */

/* REGISTER */
app.get('/register', (req,res) => {
    res.render('register');
})
app.post('/register', (req,res) => {
    console.log(req.body);
    res.redirect('/');
})
/* /REGISTER */

app.listen(PORT, ()=> {
    console.log(`Listening on PORT: ${PORT}`);
})