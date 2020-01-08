const color = require('chalk');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.use(
    new GoogleStrategy(
        {
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback'
        }, 
        (accessToken, refreshToken, profile, done) => {
            console.log(color.yellow('Google Authen'), ': AccessToken [', accessToken, ']');
            console.log(color.yellow('Google Authen'), ': RefreshToken [', refreshToken, ']');
            console.log(color.yellow('Google Authen'), ': Profile [', profile.id, ']');

            new User({ googleId: profile.id }).save();
            console.log(color.green('Mongoose'), ': Append User');
        }
    )
);