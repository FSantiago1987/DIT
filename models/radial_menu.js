let mongoose = require('mongoose');

// create a model class
let radialModel = mongoose.Schema({
    title: String,
    firstField: String,
    secondField: String,
    thirdField: String,
    fourthField: String,
    fifthField: String,
    sixthField: String
},
{
    collection: "radial_menus"
});

module.exports = mongoose.model('Radial', radialModel);
