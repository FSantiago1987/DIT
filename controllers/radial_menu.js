let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

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

        console.log(radialList[1].user);

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
        console.log(req.body);
        await Radial.create(req.body);
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
    let id = req.params.id
    let updatedRadial = Radial({
        "_id": id,
        "title": req.body.title,
        "privacy": req.body.privacy,
        "user": req.body.user,
        "fields":req.body.fields
    });

    radial = Radial.findOneAndUpdate({_id: id}, updatedRadial, (err) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {   
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
