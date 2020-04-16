const express = require("express");
const loadneticRoutes = express.Router();

const Teams = require('../../models/teams.model');

/* Get all teams */
loadneticRoutes.route('/').get(function(req, res) {
    Teams.find(function(err, loadnetic) {
        if (err) {
            console.log(err);
        } else {
            res.status(200).json(loadnetic);
        }
    });
});

/* Get team by id */
loadneticRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Teams.findById(id, function(err, loadnetic) {
        res.status(200).json(loadnetic);
    });
});

/* Add team */
loadneticRoutes.route('/add').post(function(req, res) {
    let team = new Teams(req.body);

    team.save()
        .then(team => {
            const teamId = {
                teamId: team.id
            };
            res.status(200).json(teamId);
        })
        .catch(err => {
            res.status(400).send('adding new team failed');
        });
});

/* Update team */
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
    });
});

module.exports = loadneticRoutes;