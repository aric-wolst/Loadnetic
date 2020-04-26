const express = require("express");
const projectRoutes = express.Router();

const Projects = require('../../models/project.model');

// @route GET /projects/:teamId/
// @desc Returns all projects
// @access Public
projectRoutes.route('/').get(function(req, res) {
    Projects.find(function(err, project) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).json(project);
        }
    });
});

// @route GET /projects/:id
// @desc Returns the project with the specified id
// @access Public
// @params: id = projectId
projectRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Projects.findById(id, function(err, project) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).json(project);
        }
    });
});

module.exports = projectRoutes;