let mongoose = require('mongoose');

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
    /*
    firstField: String,
    secondField: String,
    thirdField: String,
    fourthField: String,
    fifthField: String,
    sixthField: String
    */
    fields: []
},
{
    collection: "radial_menus"
});

module.exports = mongoose.model('Radial', radialModel);
