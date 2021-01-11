let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// create a reference to the model
let Radial = require('../models/radial_menu');
let userModel = require('../models/user');
let User = userModel.User;

module.exports.displayRadialList = async (req, res, next) => {
    try 
    {
        let userID = req.user._id;
        let role = req.user.role;
        let categories = req.user.categories;
        let radialList = await Radial.find()
        .populate('users')
        .lean()


        res.render('radial/list', {
            title: 'Radial Menus', 
            RadialList: radialList,
            UserID: userID.toString(),
            messages: req.flash('shareMessage'),
            Categories: categories,
            Role: role,
            displayName: req.user ? req.user.displayName: ''
        });
    } catch (err) {
        return console.error(err);
    }
}

module.exports.displayAddPage = (req, res, next) => {
    let categories = req.user.categories;
    res.render('radial/add', {title: 'Add Radial Menu', Categories: categories, displayName: req.user ? req.user.displayName: ''})          
}

module.exports.processAddPage = async (req, res, next) => {
    try {
        req.body.user = req.user.id;
        let fieldsArr = req.body.field;
        let titlesArr = req.body.titleFields;
        let newRadial = await Radial.create(req.body);
        for(let i = 0; i < fieldsArr.length; i++) {
            Radial.update({_id: newRadial._id},
                { 
                    $push: {
                        fields: [{
                            "text": fieldsArr[i],
                            "title": titlesArr[i]
                        }] 
                    }
                }, (err) => {
                    if(err) {
                        console.log(err);
                    }
                });
        }

        res.redirect('/radial-list');
    } catch (err) {
        console.log(err);
        res.end(err);
    }   
}

module.exports.displayEditPage = (req, res, next) => {
    let id = req.params.id;
    let categories = req.user.categories;

    Radial.findById(id, (err, radialToEdit) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            //show the edit view
            res.render('radial/edit', {title: 'Edit Radial', radial: radialToEdit, Categories: categories, displayName: req.user ? req.user.displayName: ''})
        }
    });
}

module.exports.processEditPage = async (req, res, next) => {
    let id = req.params.id;
    let fieldsArr = req.body.field;
    let titlesArr = req.body.titleField;

    let updatedRadial = Radial({
        "_id": id,
        "title": req.body.title,
        "privacy": req.body.privacy,
        "user": req.body.user,
        "category": req.body.category
    });

    radial = Radial.findOneAndUpdate({_id: id}, updatedRadial, (err) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {   
            for(let i = 0; i < fieldsArr.length; i++) {
                Radial.update({_id: id},
                    { 
                        $push: {
                            fields: [{
                                "text": fieldsArr[i],
                                "title": titlesArr[i]
                            }] 
                        }
                    }, (err) => {
                        if(err) {
                            console.log(err);
                        }
                    });
            }
            
            console.log(req.body);
            // refresh the book list
            res.redirect('/radial-list');
        }
    });
}

module.exports.performDelete = (req, res, next) => {
    let id = req.params.id;

    Radial.remove({_id: id}, (err) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
             // refresh the book list
             res.redirect('/radial-list');
        }
    });
}

module.exports.displayCategory = async (req, res, next) => {
    let category = req.params.category;
    
    try 
    {
        let userID = req.user._id;
        let role = req.user.role;
        let categories = req.user.categories;
        let radialList = await Radial.find()
        .populate('users')
        .lean()

        res.render('radial/category', {
            title: 'Radial Menus',
            category: category,
            Categories: categories,
            messages: req.flash('shareMessage'),
            RadialList: radialList,
            UserID: userID.toString(), 
            Role: role,
            displayName: req.user ? req.user.displayName: ''
        });
    } catch (err) {
        return console.error(err);
    }
}

module.exports.addCategory = (req, res, next) => {
    let userID = req.user._id;
    let newcat = req.params.newcat;

    User.updateOne({_id: userID}, { 
        $push: {
            categories: newcat
        }
        }, (err) => {
            if(err) {
                console.log(err);
        }
    });

    res.redirect('/radial-list');
}

module.exports.deleteCategory = (req, res, next) => {
    let userID = req.user._id;
    let newcat = req.params.newcat;

    User.updateOne({_id: userID}, { 
        $pull: {
            categories: newcat
        }
        }, (err) => {
            if(err) {
                console.log(err);
        }
    });

    res.redirect('/radial-list');
}

module.exports.displayContentPage = (req, res, next) => {
    let id = req.params.id;
    let number = parseInt(req.params.number);

    Radial.findById(id, (err, radialToDisplay) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            //show the edit view
            res.render('radial/content', {title: 'Sundial Content', radial: radialToDisplay, Number: number, displayName: req.user ? req.user.displayName: ''})
        }
    });
}


module.exports.performShare = (req, res, next) => {
    let id = req.params.id;
    let email = req.params.email;

    User.findOne({"email": email}, (err, foundUser) => {
        if(err) 
        {
            console.log(err);
            res.end(err);
            
        }
        else if(foundUser == null) 
        {
            req.flash('shareMessage', 'User not found');
            return res.redirect('/radial-list');
        }
        else
        {
            Radial.updateOne({_id: id},
                { 
                    $push: {
                        shared_users: foundUser._id.toString()
                    }
                }, (err) => {
                    if(err) {
                        console.log(err);
                    }
            });

            req.flash('shareMessage', 'Shared successfully');
            return res.redirect('/radial-list');
        }
    });
 
}


