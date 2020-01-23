const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    googleId: String,
    facebookId: String,
    email: String,
    displayName: String,
    image: String,
    credits: {type: Number, default: 0},
});

mongoose.model('users', userSchema);