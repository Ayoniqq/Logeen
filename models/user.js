const mongoose =  require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

//SCHEMA
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})
userSchema.plugin(passportLocalMongoose);

//MODEL
const User = mongoose.model('User', userSchema);

module.exports = User;