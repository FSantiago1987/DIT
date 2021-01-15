let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// create a reference to the model
let Radial = require('../models/radial_menu');
let userModel = require('../models/user');
let User = userModel.User;

// display list.ejs page
module.exports.displayRadialList = async (req, res, next) => {
    try 
    {
        let userID = req.user._id;
        let role = req.user.role;
        let categories = req.user.categories;
        let contacts = req.user.contacts;
        let radialList = await Radial.find()
        .populate('users')
        .lean()


        res.render('radial/list', {
            title: 'Sundials', 
            RadialList: radialList,
            UserID: userID.toString(),
            messages: req.flash('shareMessage'),
            Categories: categories,
            Contacts: contacts,
            Role: role,
            displayName: req.user ? req.user.displayName: ''
        });
    } catch (err) {
        return console.error(err);
    }
}

// display add.ejs page
module.exports.displayAddPage = (req, res, next) => {
    let categories = req.user.categories;
    let category = req.params.category;
    res.render('radial/add', {title: 'Add New Sundial', Categories: categories, Category: category, displayName: req.user ? req.user.displayName: ''})          
}

// post add.ejs page
module.exports.processAddPage = async (req, res, next) => {
    try {
        // check if category exist, if not add it
        let userID = req.user._id;
        let category = req.params.category;
        let enteredCategory = req.body.category;
        
        if(enteredCategory.toLowerCase() != category) {
            User.updateOne({_id: userID}, { 
                $addToSet: {
                    categories: enteredCategory
            }
                }, (err) => {
                        if(err) {
                            console.log(err);
                }
            });
        }
        
        // create a sundial with all the filled fields 
        req.body.user = req.user.id;
        let fieldsArr = req.body.field;
        let titlesArr = req.body.titleFields;

        let objArr = []

        for(let i = 0; i < titlesArr.length; i++) {
            let newObj = {
                "text": fieldsArr[i],
                "title": titlesArr[i]
            }

            objArr.push(newObj);
        }

        let newRadial = await Radial.create(req.body);
            Radial.update({_id: newRadial._id},
                { 
                    $push: {
                        fields: objArr
                    }
                }, (err) => {
                    if(err) {
                        console.log(err);
                    }
                });
       
        res.redirect('/radial-list');
    } catch (err) {
        console.log(err);
        res.end(err);
    }   
}

// display edit.ejs page
module.exports.displayEditPage = (req, res, next) => {
    let id = req.params.id;
    let categories = req.user.categories;

    // find sundial by id and show it
    Radial.findById(id, (err, radialToEdit) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            //show the edit view
            res.render('radial/edit', {title: 'Edit Sundial', radial: radialToEdit, Categories: categories, displayName: req.user ? req.user.displayName: ''})
        }
    });
}

// post edit.ejs page
module.exports.processEditPage = async (req, res, next) => {
    let id = req.params.id;
    let fieldsArr = req.body.field;
    let titlesArr = req.body.titleField;

    // array of object from fields entered by user
    let objArr = [
        {
            "text": fieldsArr[0],
            "title": titlesArr[0]
        },
        {
            "text": fieldsArr[1],
            "title": titlesArr[1]
        },
        {
            "text": fieldsArr[2],
            "title": titlesArr[2]
        },
        {
            "text": fieldsArr[3],
            "title": titlesArr[3]
        },
        {
            "text": fieldsArr[4],
            "title": titlesArr[4]
        },
        {
            "text": fieldsArr[5],
            "title": titlesArr[5]
        }
    ]

    // save updated sundial inside a variable
    let updatedRadial = Radial({
        "_id": id,
        "title": req.body.title,
        "privacy": req.body.privacy,
        "user": req.body.user,
        "category": req.body.category,
    });
    
    // find sundial by id and replace it with updated one,
    // then push obj array into updated radial
    radial = Radial.findOneAndUpdate({_id: id}, updatedRadial, (err) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {   
            Radial.update({_id: id},
                { 
                    $push: {
                        fields: objArr
                    }
                }, (err) => {
                    if(err) {
                        console.log(err);
                    }
                });
            
            console.log(req.body);
            // refresh the book list
            res.redirect('/radial-list');
        }
    });
}

// delete sundial
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

// display category.ejs page
// similar to display list.ejs
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
            title: 'Sundials',
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

// adds a new category to the user
module.exports.addCategory = (req, res, next) => {
    let userID = req.user._id;
    let newcat = req.params.newcat;

    User.updateOne({_id: userID}, { 
        $addToSet: {
            categories: newcat
        }
        }, (err) => {
            if(err) {
                console.log(err);
        }
    });

    res.redirect('/radial-list');
}

// delete a category
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

// display content.ejs
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

// perform share
module.exports.performShare = (req, res, next) => {
    let id = req.params.id;
    let email = req.params.email;
    let userID = req.user._id;

    // find recipient user by email
    User.findOne({"email": email}, (err, foundUser) => {
        if(err) 
        {
            console.log(err);
            res.end(err);
            
        }
        // if user email is not registered
        else if(foundUser == null) 
        {
            req.flash('shareMessage', 'User not found');
            return res.redirect('/radial-list');
        }
        else
        {
            // if everything fine, find sundial that user want to share
            Radial.findById(id, (err, radialToShare) => {
                if(err)
                {
                    console.log(err);
                    res.end(err);
                }
                else
                {
                    //  save new sundial inside a variable, and fill it with found sundial information
                    // changin only category and adding from field
                    let newRadial = ({
                        "title": radialToShare.title,
                        "privacy": radialToShare.privacy,
                        "user": foundUser._id,
                        "from": req.user.displayName,
                        "category": "Shared Sundials",
                        "fields": radialToShare.fields
                    })
                    Radial.create(newRadial);

                    // update contact list of user with recipient email
                    User.updateOne({_id: userID}, { 
                        $addToSet: {
                            contacts: email
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
    });
}

// delete a contact
module.exports.deleteContact = (req, res, next) => {
    let userID = req.user._id;
    let contact = req.params.contact;

    User.updateOne({_id: userID}, { 
        $pull: {
            contacts: contact
        }
        }, (err) => {
            if(err) {
                console.log(err);
        }
    });

    res.redirect('/radial-list');
}


