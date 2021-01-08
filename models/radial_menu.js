let mongoose = require('mongoose');

let fieldModel = mongoose.Schema({
    text: String,
    title: String
});

// create a model class
let radialModel = mongoose.Schema({
    title: String,
    privacy: {
        type: String,
        default: 'Public',
        enum: ['Public', 'Private']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    shared_users:[],
    category: {
        type: String,
        default: '',
        enum: ['family', 'news', 'food']
    },
    /*
    firstField: String,
    secondField: String,
    thirdField: String,
    fourthField: String,
    fifthField: String,
    sixthField: String
    */
    fields: [fieldModel],
},
{
    collection: "radial_menus"
});

module.exports = mongoose.model('Radial', radialModel);
