const express = require("express");
const userRoutes = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const validateEmail = require("../../validation/email");

// Load User model
const User = require("../../models/users.model");

// @route POST /users/register
// @desc Registers user
// @access Public
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
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        }
    });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
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
                        res.json({
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
            console.log(err);
        } else {
            res.json(users);
        }
    });
});

// @route GET /users/:id
// @desc Returns user with specified id
// @access Public
userRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    User.findById(id, function(err, user) {
        res.json(user);
    });
});

// @route POST /users/update/:id
// @desc Updates a users email
// @access Public
userRoutes.route('/update/:id').post(function(req, res) {

    // Email validation
    const { errors, isValid } = validateEmail(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email }).then(dupUser => {
        if((dupUser) && (dupUser.id !== req.params.id)){
            return res.status(400).json({ email: "Email already in use" });
        } else {
            User.findById(req.params.id, function(err, user) {
                if (!user) {
                    res.status(404).send("User not found");
                } else {
                    user.email = req.body.email;
                    user.name = req.body.name;

                    user.save().then(user => {
                        res.json('Name and email updated!');
                    }).catch(err => {
                        res.status(400).send("Update not possible");
                    });
                }
            })
        }
    });
});

module.exports = userRoutes;