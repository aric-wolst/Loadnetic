const express = require("express");
const loadneticRoutes = express.Router();

const Teams = require('../../models/teams.model');
const Projects = require('../../models/project.model');
const Users = require('../../models/users.model');

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
// @params: req.params.id = teamId
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
// @params: req.params.id = teamId, req.body = team JSON object
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
// @params: req.params.id = teamId, req.body = project JSON object
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

// @route POST /loadnetic/addMember/:id
// @desc Adds a user to the team
// @access Public
// @params: req.params.id = teamId, req.params.userId = current user id, req.body.email = user email, req.body.admin = true if admin
loadneticRoutes.route('/addMember/:id/:userId').post(function(req, res) {

    Users.findOne({ email: req.body.email }).then(user => {

        if(!user.teams.includes(req.params.id)){
            user.teams.push(req.params.id);
        }

        user.save().then(user => {

            Teams.findById(req.params.id, function(err, team) {

                if(team.teamAdminId.includes(req.params.userId)) {

                    if (!team.teamMemberId.includes(user.id)) {
                        team.teamMemberId.push(user.id);
                    }

                    if (req.body.admin) {
                        team.teamAdminId.push(user.id);
                    }

                    team.save().then(team => {
                        res.status(200).send("User added!");

                    }).catch(err => {

                        for (let i = 0; i < user.teams.length; i++) {

                            if (user.teams[i] === req.params.id) {
                                user.teams.splice(i, 1);
                                break;
                            }
                        }

                        user.save().then(
                            res.status(400).send("Error adding user")
                        );
                    });
                } else {
                    for (let i = 0; i < user.teams.length; i++) {

                        if (user.teams[i] === req.params.id) {
                            user.teams.splice(i, 1);
                            break;
                        }
                    }

                    user.save().then(
                        res.status(400).send("Error adding user")
                    );
                }

            }).catch(err => {

                for(let i = 0; i < user.teams.length; i++){

                    if(user.teams[i] === req.params.id){
                        user.teams.splice(i,1);
                        break;
                    }
                }

                user.save().then(
                    res.status(400).send("Error finding current team!")
                );
            });

        }).catch(err => {
            res.status(400).send("Error adding user");
        });

    }).catch(err => {
        res.status(400).send("Email does not exist");
    });
});

// @route POST /loadnetic/promote/:id
// @desc Promotes a user to admin on the team
// @access Public
// @params: req.params.id = teamId, req.params.userId = current user id, req.body.email = user email JSON object
loadneticRoutes.route('/promote/:id/:userId').post(function(req, res) {

    Users.findOne({ email: req.body.email }).then(user => {

        if(!user.teams.includes(req.params.id)){
            user.teams.push(req.params.id);
        }

        user.save().then(user => {

            Teams.findById(req.params.id, function(err, team) {

                if(team.teamAdminId.includes(req.params.userId)) {

                    if (!team.teamAdminId.includes(user.id)) {
                        team.teamAdminId.push(user.id);
                    }

                    if (!team.teamMemberId.includes(user.id)) {
                        team.teamMemberId.push(user.id);
                    }

                    team.save().then(team => {
                        res.status(200).json("User promoted!");

                    }).catch(err => {
                        res.status(400).send("Error promoting user")
                    });

                }

            }).catch(err => {
                    res.status(400).send("Error finding current team!")
            });

        }).catch(err => {
            res.status(400).send("Error finding user");
        });

    }).catch(err => {
        res.status(400).send("Email does not exist");
    });
});

// @route POST /loadnetic/demote/:id
// @desc Demotes a user from admin on the team
// @access Public
// @params: req.params.id = teamId, req.params.userId = current user id, req.body.email = user email
loadneticRoutes.route('/demote/:id/:userId').post(function(req, res) {

    Users.findOne({ email: req.body.email }).then(user => {

        if(!user.teams.includes(req.params.id)){
            user.teams.push(req.params.id);
        }

        user.save().then(user => {

            Teams.findById(req.params.id, function(err, team) {

                if(team.teamAdminId.includes(req.params.userId)) {

                    for (let i = 0; i < team.teamAdminId.length; i++) {

                        if (!team.teamMemberId.includes(user.id)) {
                            team.teamMemberId.push(user.id);
                        }

                        if (team.teamAdminId[i] === user.id) {
                            team.teamAdminId.splice(i, 1);
                            break;
                        }
                    }

                    team.save().then(team => {
                        res.status(200).json("User demoted!");

                    }).catch(err => {
                        res.status(400).send("Error demoting user");
                    });

                }

            }).catch(err => {
                res.status(400).send("Error finding current team!");
            });

        }).catch(err => {
            res.status(400).send("Error finding user");
        });

    }).catch(err => {
        res.status(400).send("Email does not exist");
    });
});

// @route POST /loadnetic/removeMember/:id
// @desc Removes a user from the team
// @access Public
// @params: req.params.id = teamId, req.params.userId = current user id, req.body.email = user email
loadneticRoutes.route('/removeMember/:id/:userId').post(function(req, res) {

    Users.findOne({ email: req.body.email }).then(user => {

        for(let i = 0; i < user.teams.length; i++){

            if(user.teams[i] === req.params.id){
                user.teams.splice(i,1);
                break;
            }
        }

        user.save().then(user => {

            Teams.findById(req.params.id, function(err, team) {

                if(team.teamAdminId.includes(req.params.userId)) {

                    for (let i = 0; i < team.teamMemberId.length; i++) {

                        if (team.teamMemberId[i] === user.id) {
                            team.teamMemberId.splice(i, 1);
                            break;
                        }
                    }

                    for (let i = 0; i < team.teamAdminId.length; i++) {

                        if (team.teamAdminId[i] === user.id) {
                            team.teamAdminId.splice(i, 1);
                            break;
                        }
                    }

                    team.save().then(team => {
                        res.status(200).send("User removed!");

                    }).catch(err => {

                        user.teams.push(req.params.id);

                        user.save.then(
                            res.status(400).send("Error removing user")
                        );
                    });

                } else {

                    user.teams.push(req.params.id);

                    user.save.then(
                        res.status(400).send("Error finding current team!")
                    );
                }

            }).catch(err => {

                user.teams.push(req.params.id);

                user.save.then(
                    res.status(400).send("Error finding current team!")
                );
            });

        }).catch(err => {
            res.status(400).send("Error adding user");
        });

    }).catch(err => {
        res.status(400).json("Email does not exist");
    });
});

// @route GET /loadnetic/hasProject/:projectId/:teamId
// @desc Returns project if the user is part of the project, which is part of the team
// @access Public
// @params: id = userId, projectId = projectId, teamId = teamId
loadneticRoutes.route('/hasProject/:id/:teamId/:projectId').get(function(req, res) {

    let projectId = req.params.projectId;
    let teamId = req.params.teamId;
    let id = req.params.id;

    Teams.findById(teamId, function (err, team) {

        if(!team){

            res.status(404).send("Current team not found");

        } else {

            let projects = team.teamProjects.values();
            let hasProject = projects.includes(projectId);
            let ret = {};

            if(hasProject){

                Projects.findById(projectId, function(err, project) {

                    hasProject = project.projectMemberId.values().includes(id);

                    if(hasProject){

                        ret.project = project;
                        ret.hasProject = hasProject;
                        res.status(200).send(ret);

                    } else {
                        ret.hasProject = hasProject;
                        ret.project = "null";
                        res.status(200).send(ret);
                    }

                }).catch(err => {
                    res.status(400).send("Error finding project")
                });

            } else {
                ret.hasProject = hasProject;
                ret.project = "null";
                res.status(200).send(ret);
            }
        }

    }).catch(err => {
        res.status(400).send("Error finding team")
    });

});


module.exports = loadneticRoutes;