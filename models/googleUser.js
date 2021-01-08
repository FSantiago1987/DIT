

// require modules for the User Model
let mongoose = require('mongoose');

let GoogleUser = new mongoose.Schema
(
    {
        username: 
        {
            type: String,
            required: true
        },
        email:
        {
            type: String,
            required: true
        },
        displayName:
        {
            type: String,
            required: true
        },
        role: {
            type: String,
            default: 'User',
            enum: ['User', 'Caregiver'],
            trim: true,
            required: 'Role is required'
        },
        created:
        {
            type: Date,
            default: Date.now,
        },
        update:
        {
            type: Date,
            default: Date.now,
        }

    },
    {
        collection: "users"
    }
);

module.exports = mongoose.model('GoogleUser', GoogleUser);