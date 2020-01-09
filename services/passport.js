const color = require('chalk');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user);
    });
});

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

            User.findOne({ googleId: profile.id }).then(existingUser => {
                if(existingUser){
                    // User exist
                    done(null, existingUser);
                    console.log(color.green('Mongoose'), ': Fetch User');
                }else{
                    // Create new User
                    new User({ googleId: profile.id }).save()
                        .then(user => done(null, user));
                    console.log(color.green('Mongoose'), ': Append User');
                }
            });
        }
    )
);