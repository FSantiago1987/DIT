let GoogleStrategy = require('passport-google-oauth20').Strategy;
let LocalStrategy = require('passport-local').Strategy;
let mongoose = require('mongoose');
let {user} = require('passport');

let GoogleUser = require('../models/googleUser');
let DB = require('./db');

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
        clientID: DB.GOOGLE_ID,
        clientSecret: DB.GOOGLE_SECRET,
        callbackURL: '/auth/google/callback'        
    }, async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        let newUser = {
            username: profile.id,
            email: profile.emails[0].value,
            displayName: profile.displayName,
        }
        try {
            let googleUser = await GoogleUser.findOne({username: profile.id})
            if(googleUser){
                done(null, googleUser);
            } else {
                googleUser = await GoogleUser.create(newUser);
                done(null, googleUser);
            }
        } catch (err) {
            console.error(err);
        }
    }));

    passport.serializeUser((googleUser, done) => done(null, googleUser.id));

    passport.deserializeUser((id, done) => {
        GoogleUser.findById(id, (err, googleUser) => done(err, googleUser));
    })
}