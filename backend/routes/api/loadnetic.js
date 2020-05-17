const express = require("express");
const loadneticRoutes = express.Router();

const Teams = require('../../models/teams.model');
const Projects = require('../../models/project.model');

// @route GET /loadnetic/
// @desc Returns all teams
// @access Public
loadneticRoutes.route('/').get(function(req, res) {
    Teams.find(function(err, loadnetic) {
        if (err) {
            res.status(400).send("Cannot find teams");
        } else {
            res.status(200).json(loadnetic);
        }
    }).catch(err => {
        res.status(400).send("Error finding current team!");
    });
});

// @route GET /loadnetic/:id
// @desc Returns the team with the specified id
// @access Public
// @params: id = teamId
loadneticRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Teams.findById(id, function(err, loadnetic) {
        if (err) {
            res.status(400).send("Cannot find team");
        } else {
            res.status(200).json(loadnetic);
        }
    }).catch(err => {
        res.status(400).send("Error finding current team!");
    });
});

// @route POST /loadnetic/update/:id
// @desc Updates the specified team
// @access Public
// @params: id = teamId, req = team JSON object
loadneticRoutes.route('/update/:id').post(function(req, res) {
    Teams.findById(req.params.id, function(err, team) {
        if (!team) {
            res.status(404).send("data is not found");
        } else {
            team.teamName = req.body.teamName;
            team.teamDescription = req.body.teamDescription;

            team.save().then(team => {
                res.status(200).json('Team updated!');
            }).catch(err => {
                res.status(400).send("Update not possible");
            });
        }
    }).catch(err => {
        res.status(400).send("Error finding current team!");
    });
});

// @route POST /loadnetic/addProject/:id
// @desc Creates a project and adds it to the specified team's list of projects
// @access Public
// @params: id = teamId, req = project JSON object
loadneticRoutes.route('/addProject/:id').post(function(req, res) {
    let project = new Projects(req.body);

    project.save()
        .then(project => {
            Teams.findById(req.params.id, function(err, team) {
                if(!team){
                    res.status(404).send("Current team not found");
                } else {
                    team.teamProjects.push(project.id);

                    team.save().then(team => {
                        res.status(200).json("Project created!");
                    }).catch(err => {
                        res.status(400).send("Project creation not possible!");
                    });
                }
            }).catch(err => {
                res.status(400).send("Error finding current team!");
            });
        }).catch(err => {
            res.status(400).send("Adding new project failed");
    });
});

module.exports = loadneticRoutes;