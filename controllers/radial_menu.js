let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let say = require('say');

// create a reference to the model
let Radial = require('../models/radial_menu');

module.exports.displayRadialList = async (req, res, next) => {
    try 
    {
        let userID = req.user._id;
        let role = req.user.role;
        let radialList = await Radial.find()
        .populate('users')
        .lean()


        res.render('radial/list', {
            title: 'Radial Menus', 
            RadialList: radialList,
            UserID: userID.toString(), 
            Role: role,
            displayName: req.user ? req.user.displayName: ''
        });
    } catch (err) {
        return console.error(err);
    }
}

module.exports.displayAddPage = (req, res, next) => {
    res.render('radial/add', {title: 'Add Radial Menu', displayName: req.user ? req.user.displayName: ''})          
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

    Radial.findById(id, (err, radialToEdit) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            //show the edit view
            res.render('radial/edit', {title: 'Edit Radial', radial: radialToEdit, displayName: req.user ? req.user.displayName: ''})
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
        let radialList = await Radial.find()
        .populate('users')
        .lean()

        console.log(radialList[1].user);

        res.render('radial/category', {
            title: 'Radial Menus',
            category: category,
            RadialList: radialList,
            UserID: userID.toString(), 
            Role: role,
            displayName: req.user ? req.user.displayName: ''
        });
    } catch (err) {
        return console.error(err);
    }
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
            res.render('radial/content', {title: 'Content Radial', radial: radialToDisplay, Number: number, displayName: req.user ? req.user.displayName: ''})
        }
    });
}

module.exports.processContentPage = (req, res) => {
    let str = req.body.fields;
    say.speak(str);
}

