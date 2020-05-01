const express = require("express");
const userRoutes = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/users.model");
const Teams = require("../../models/teams.model");

// @route POST /users/register
// @desc Registers user
// @access Public
// @params: req = user JSON object
userRoutes.post("/register", (req, res) => {
    // Form validation
    const { errors, isValid } = validateRegisterInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: "Email already exists" });
        } else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });
            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.status(200).json(user))
                        .catch(err => res.status(400).json("Unable to register!"));
                });
            });
        }
    });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
// @params: req = user JSON email and password
userRoutes.post("/login", (req, res) => {
    // Form validation
    const { errors, isValid } = validateLoginInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    // Find user by email
    User.findOne({ email }).then(user => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({ emailnotfound: "Email not found" });
        }
        // Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // User matched, create JWT Payload
                const payload = {
                    id: user.id,
                    name: user.name,
                    email: user.email
                };
                // Sign token
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 28800 //  8 hours
                    },
                    (err, token) => {
                        res.status(200).json({
                            success: true,
                            token: "Bearer " + token
                        });
                    }
                );
            } else {
                return res
                    .status(400)
                    .json({ passwordincorrect: "Password incorrect" });
            }
        });
    });
});

// @route GET /users/
// @desc Returns all users
// @access Public
userRoutes.route('/').get(function(req, res) {
    User.find(function(err, users) {
        if (err) {
            res.status(400).json("Cannot find users");
        } else {
            res.status(200).json(users);
        }
    }).catch(err=> {
        res.status(400).send("Error finding users");
    });;
});

// @route GET /users/:id
// @desc Returns user with specified id
// @access Public
// @params: id = userId
userRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    User.findById(id, function(err, user) {
        if (err) {
            res.status(400).json("Cannot find user");
        } else {
            res.status(200).json(user);
        }
    }).catch(err=> {
        res.status(400).send("Error finding user");
    });;
});

// @route POST /users/update/:id
// @desc Updates a users email and name
// @access Public
// @params: req = user JSON object id = userId
userRoutes.route('/update/:id').post(function(req, res) {

    User.findOne({ email: req.body.email }).then(dupUser => {
        if((dupUser) && (dupUser.id !== req.params.id)){
            return res.status(400).json({ email: "Update failed: New email already in use" });
        } else {
            User.findById(req.params.id, function(err, user) {
                if (!user) {
                    res.status(404).send("User not found");
                } else {
                    user.email = req.body.email;
                    user.name = req.body.name;

                    user.save().then(user => {
                        res.status(200).json('Name and email updated!');
                    }).catch(err => {
                        res.status(400).send("Update not possible");
                    });
                }
            }).catch(err=> {
                res.status(400).send("Error finding user");
            });
        }
    });
});

// @route POST /users/addTeam/:id
// @desc Creates a teams and then adds it to the specified user's list of teams
// @access Public
// @params: req = team JSON object id = userId
userRoutes.route('/addTeam/:id').post(function(req, res) {
    let team = new Teams(req.body);

    team.save()
        .then(team => {
            User.findById(req.params.id, function(err, user) {
                if(!user){
                    res.status(404).send("Current user not found");
                } else {
                    user.teams.push(team.id);

                    user.save().then(user => {
                        res.status(200).json('Team created!');
                    }).catch(err => {
                        res.status(400).send("Team creation not possible!");
                    });
                }
            }).catch(err=> {
                    res.status(400).send("Error finding user");
                });
    }).catch(err => {
            res.status(400).send('Adding new team failed');
    });
});

// @route GET /users/getTeams/:id
// @desc Returns all of a user's teams as JSON objects
// @access Public
// @params: id = userId
userRoutes.route('/getTeams/:id').get(function(req, res) {
    let id = req.params.id;
    User.findById(id, function(err, user) {
        if(!user){
            res.status(404).send("Current user not found");
        } else {
            let teams = [];
            let userTeams = user.teams.values();
            let i = 0;
            for(let elements of userTeams){
                Teams.findById(elements, function(err, team) {
                    if(!team){
                        res.status(404).send("Team not found");
                    } else {
                        teams.push(team);
                        i++;
                        if (i === user.teams.length) {
                            res.status(200).send(teams);
                        }
                    }
                });
            }
        }
    }).catch(err=> {
        res.status(400).send("Error finding user");
    });
});

// @route GET /users/hasTeam/:id/:teamId
// @desc Returns true if the user is part of the team
// @access Public
// @params: id = userId, teamId = teamId
userRoutes.route('/hasTeam/:id/:teamId').get(function(req, res){
    let userId = req.params.id;
    let teamId = req.params.teamId;

    User.findById(userId, function(err, user) {
        if(!user){
            res.status(404).send("Current user not found");
        } else {
            let teams = user.teams.values();
            let hasTeam = false;
            for(let team of teams){
                if(team === teamId){
                    hasTeam = true;
                    break;
                }
            }
            res.status(200).send(hasTeam);
        }
    }).catch(err=> {
        res.status(400).send("Error finding user");
    });
});

module.exports = userRoutes;