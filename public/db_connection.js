/* ---------------<--MONGO DB CONNECTION -->-------------------------*/
const mongoose = require('mongoose');
const dbUrlLocal = 'mongodb://127.0.0.1:27017/logeen';
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