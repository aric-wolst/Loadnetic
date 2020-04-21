const mongoose = require('mongoose');

const Projects = new mongoose.Schema({
    projectName: {
        type: String,
        required: true
    },
    projectDescription: {
        type: String,
        required: true
    },
    projectAdminId: {
        type: [String],
        required: true
    },
    projectMemberId: {
        type: [String],
        required: true
    }
});

module.exports = Project = mongoose.model('Projects', Projects);