const mongoose = require('mongoose');

const Teams = new mongoose.Schema({
    teamName: {
        type: String,
        required: true
    },
    teamDescription: {
        type: String,
        required: true
    },
    teamSize: {
        type: String,
        required: true
    },
    teamAdminId: {
        type: [String],
        required: true
    },
    teamMemberId: {
        type: [String],
        required: true
    },
    teamProjects: {
        type: [String],
        required: false
    }

});

module.exports = Team = mongoose.model('Teams', Teams);