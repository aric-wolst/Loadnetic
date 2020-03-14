const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Teams = new Schema({
    teamName: {
        type: String
    },
    teamDescription: {
        type: String
    },
    teamSize: {
        type: String
    },
    teamCreatorId: {
        type: String
    }
});

module.exports = mongoose.model('Teams', Teams);