const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path');

const dbUrlLocal = 'mongodb://127.0.0.1:27017/logeen';
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');

const passport = require('passport');
const passportLocal = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const User = require('./models/user');

app.set('view engine', 'ejs'); //EJS
app.set('views', path.join(__dirname, 'views')); //EJS

app.use(express.urlencoded({ extended: true })); //BODY PARSER FOR FORMS(req.body) 
//app.use(bodyParser.urlencoded({extended:true}));

const secret = process.env.SECRET || 'mySecret';
const store = new MongoStore({
    mongoUrl: dbUrlLocal,
    secret: secret,
    touchAfter: 24 * 60 * 60
})

store.on('error', function (e) {
    console.log("STORE SESSION ERROR", e)
})

//STORE SESSION IN MONGO
app.use(session({
    secret,
    store: MongoStore.create({ mongoUrl: dbUrlLocal }),
    resave: true,
    saveUninitialized: false,
}));

//FOR SESSION
const sessionConfig = {
    store,
    name: 'session',
    secret: secret,
    resave: true,
    saveUninitialized: true,
    cookies: {
        httpOnly: true,
        //secure: true, //Use this when it is hosted online but diable when on localhost
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7

    }
}
app.use(session(sessionConfig));

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

/* ---------------<--END OF MONGO DB CONNECTION -->-------------------------*/

app.get('/', isLoggedIn, (req, res) => {
    res.render('home');
});

/* REGISTER */
app.get('/register', (req,res) => {
    res.render('register');
})
app.post('/register', async (req,res) => {
    console.log(req.body);
    const {email, username, password} = req.body;
    const user = new User({email, username});
    const regUser = await User.register(user, password);
    res.redirect('/');
})
/* /REGISTER */

/* LOGIN */
app.get('/login', (req,res) => {
    res.render('login');   
})
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
}), (req,res) => {
    console.log(req.body);
})
/* /LOGIN */

/* LOGOUT */
app.get('/logout', (req,res) => {
    req.logout(err => {
        if (err) {
            return next(err)
        }
    });
    res.redirect('/');
})

//MIDDLEWARE TO CONFIRM USER IS LOGGED IN 
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()) return next();
    res.redirect('/login');
}

app.listen(PORT, ()=> {
    console.log(`Listening on PORT: ${PORT}`);
});