const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please enter a password"],
        unique: [true, "An account with that email exists"]
    }, password: {
        type: String,
        required: [true, "Please enter a password"]
    }, username: {
        type: String,
        required: [true, "Please enter a username"],
        unique: [true, "The username already exists"]
    }
}, {timestamps: true});

const User = mongoose.model('user', userSchema);

module.exports = User;