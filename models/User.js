const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    googleId: String,
    facebookId: String,
    email: String,
    displayName: String,
    image: String,
});

mongoose.model('users', userSchema);