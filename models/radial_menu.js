let mongoose = require('mongoose');

let fieldModel = mongoose.Schema({
    title: String,
    text: String
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
    from: String,
    category: {
        type: String,
        default: ''
    },

    fields: [fieldModel],
},
{
    collection: "radial_menus"
});

module.exports = mongoose.model('Radial', radialModel);
