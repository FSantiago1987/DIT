let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport =  require('passport');

// define the User Model Instance
let userModel = require('../models/user');
let User = userModel.User;

module.exports.displayLoginPage = (req, res, next) => {
    // check if the user is already logged in
    if(!req.user)
    {
        res.render('auth/login', 
        {
            title: "Login",
            messages: req.flash('loginMessage'),
            displayName: req.user ? req.user.displayName: ''
        });
    }
    else
    {
        console.log(req.user.displayName);
        return res.redirect('/');
    }
}

module.exports.processLoginPage = (req, res, next) => {
    passport.authenticate('local', 
    (err, user, info) => {
        if(err)
        {
            console.log(err);
            return next(err);
        }
        // is there a user login error?
        if(!user)
        {
            console.log(err);
            req.flash('loginMessage', 'Authentication Error');
            return res.redirect('/login');
        }
        req.login(user, (err) => {
            //server error?
            if(err)
            {
                return next(err);
            }
            return res.redirect('/');
        });
    })(req, res, next);
}


module.exports.displayForgotPassword = (req, res, next) => {
    req.flash(
        'loginMessage',
        'If you are having trouble to connect or forgot your password. Please contact: info@gnomontalk.com'
    );
    return res.redirect('/login');
}

module.exports.displayRegisterPage = (req,res, next) => {
    if(!req.user)
    {
        res.render('auth/register', 
        {
            title: 'Register',
            messages: req.flash('registerMessage'),
            displayName: req.user ? req.user.displayName: ''
        });
    }
    else
    {
        return res.redirect('/');
    }
}

module.exports.processRegisterPage = (req,res, next) => {
    // instantiate a user object
    if(req.body.password.length < 7) {
        req.flash(
            'registerMessage',
            'Registration Error: Password must have at least 7 characters'
        );
        return res.render('auth/register', {
            title: 'Register',
            messages: req.flash('registerMessage'),
            displayName: req.user ? req.user.displayName: ''                
        });
    } 
    else 
    {
        let newUser = new User({
            username: req.body.username,
            //password: req.body.password,
            email: req.body.email,
            displayName: req.body.displayName,
            role: req.body.role
        });

        User.register(newUser, req.body.password, (err) => {
            if(err)
            {
                console.log("Error: inserting New User");
                if(err.name == "UserExistsError")
                {
                    req.flash(
                        'registerMessage',
                        'Registration Error: User Already Exists!'
                    );
                    console.log('Error: User Already Exists!');
                }
                return res.render('auth/register', {
                    title: 'Register',
                    messages: req.flash('registerMessage'),
                    displayName: req.user ? req.user.displayName: ''                
                });
            }
            else
            {
                //if no error exists, then registration is successful

                // redirect the user and authenticate them
                return passport.authenticate('local') (req, res, () => {
                    res.redirect('/');
                });
            }
        });
    }
}

module.exports.performLogout = (req, res, next) => {
    req.logout();
    res.redirect('/');
}
