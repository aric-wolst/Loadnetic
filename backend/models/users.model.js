const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Users = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    organizations: {
        type: [String],
        required: false
    }
});

module.exports = User = mongoose.model("users", Users);