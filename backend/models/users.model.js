const mongoose = require('mongoose');

let Users = new mongoose.Schema({
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
    teams: {
        type: [String],
        required: false
    }
});

module.exports = User = mongoose.model("users", Users);