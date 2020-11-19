let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// create a reference to the model
let Radial = require('../models/radial_menu');

module.exports.displayRadialList = (req, res, next) => {
    Radial.find((err, radialList) => {
        if(err)
        {
            return console.error(err);
        }
        else
        {
            res.render('radial/list', {title: 'Radial Menus', RadialList: radialList});
        }
    });
}

module.exports.displayAddPage = (req, res, next) => {
    res.render('radial/add', {title: 'Add Radial Menu'})          
}

module.exports.processAddPage = (req, res, next) => {
    let newRadial = Radial({
        "title": req.body.title,
        "firstField": req.body.firstField,
        "secondField": req.body.secondField,
        "thirdField": req.body.thirdField,
        "fourthField": req.body.fourthField,
        "fifthField": req.body.fifthField,
        "sixthField": req.body.sixthField
    });

    Radial.create(newRadial, (err, Radial) =>{
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
            res.render('radial/edit', {title: 'Edit Radial', radial: radialToEdit})
        }
    });
}

module.exports.processEditPage = (req, res, next) => {
    let id = req.params.id

    let updatedRadial = Radial({
        "_id": id,
        "title": req.body.title,
        "firstField": req.body.firstField,
        "secondField": req.body.secondField,
        "thirdField": req.body.thirdField,
        "fourthField": req.body.fourthField,
        "fifthField": req.body.fifthField,
        "sixthField": req.body.sixthField
    });

    Radial.updateOne({_id: id}, updatedRadial, (err) => {
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
