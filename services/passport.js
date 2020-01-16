const color = require('chalk');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {done(null, user);});
});

passport.use(
    new GoogleStrategy(
        {
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback',
        proxy: true
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log(color.yellow('Google Authen'), ': AccessToken [', accessToken, ']');
            console.log(color.yellow('Google Authen'), ': RefreshToken [', refreshToken, ']');
            console.log(color.yellow('Google Authen'), ': Profile [', profile, ']');
            
            let existingUser = await User.findOne({ googleId: profile.id });
            if (existingUser) {
                existingUser.googleId = profile.id
                existingUser.email = profile.emails.find(x => x.verified).value || '';
                existingUser.image = profile.photos.find(x => x).value || '';
                existingUser.displayName = profile.displayName;
                await existingUser.save();
                console.log(color.green('Mongoose'), ': Fetch User');
                return done(null, existingUser);
            }
            const user = await new User({ 
                googleId: profile.id,
                email: profile.emails.find(x => x.verified).value || '',
                image: profile.photos.find(x => x).value || '',
                displayName: profile.displayName
            }).save();
            console.log(color.green('Mongoose'), ': Append User');
            done(null, user);
        }
    )
);

FacebookStrategy.prototype.authorizationParams = function (options) {
    var params = {};
    params.auth_type = "reauthenticate";
    return params;
};

passport.use(
    new FacebookStrategy(
        {
            clientID: keys.facebookAppID,
            clientSecret: keys.facebookAppSecret,
            callbackURL: "/auth/facebook/callback",
            profileFields: ['id', 'displayName', 'photos', 'email'],
            proxy: true
        },
        async function(accessToken, refreshToken, profile, done) {
            console.log(color.blue('Facebook Authen'), ': AccessToken [', accessToken, ']');
            console.log(color.blue('Facebook Authen'), ': RefreshToken [', refreshToken, ']');
            console.log(color.blue('Facebook Authen'), ': Profile [', profile, ']');

            let existingUser = await User.findOne({$or: [
                {facebookId: profile.id},
                {email: profile.emails.find(x => x).value}
            ]});
            if (existingUser) {
                existingUser.facebookId = profile.id
                existingUser.email = profile.emails.find(x => x).value || '';
                existingUser.image = profile.photos.find(x => x).value || '';
                existingUser.displayName = profile.displayName;
                await existingUser.save();
                console.log(color.green('Mongoose'), ': Fetch User');
                return done(null, existingUser);
            }
            const user = await new User({ 
                facebookId: profile.id,
                email: profile.emails.find(x => x).value || '',
                image: profile.photos.find(x => x).value || '',
                displayName: profile.displayName
            }).save();
            console.log(color.green('Mongoose'), ': Append User');
            done(null, user);
        }
    )
);