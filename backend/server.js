const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

/* Routes */
const loadneticRoutes = express.Router();
const userRoutes = express.Router();
const PORT = 4000;

/* Models */
let Teams = require('./teams.model');
let Users = require('./users.model');

app.use(cors());
app.use(bodyParser.json());
app.use('/loadnetic', loadneticRoutes);
app.use('/users', userRoutes);

/* Connect to mongo */
mongoose.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
});

/* Get all organizations */
loadneticRoutes.route('/').get(function(req, res) {
    Teams.find(function(err, loadnetic) {
        if (err) {
            console.log(err);
        } else {
            res.json(loadnetic);
        }
    });
});

/* Get organization by id */
loadneticRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Teams.findById(id, function(err, loadnetic) {
        res.json(loadnetic);
    });
});

/* Add organization */
loadneticRoutes.route('/add').post(function(req, res) {
    let team = new Teams(req.body);
    team.save()
        .then(team => {
            res.status(200).json({'team': 'team added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new team failed');
        });
});

/* Update organization */
loadneticRoutes.route('/update/:id').post(function(req, res) {
    Teams.findById(req.params.id, function(err, team) {
        if (!team) {
            res.status(404).send("data is not found");
        } else {
            team.teamName = req.body.teamName;
            team.teamDescription = req.body.teamDescription;
            team.teamSize = req.body.teamSize;
            team.teamAdminId = req.body.teamAdminId;
            team.teamMemberId = req.body.teamMemberId;
            team.teamProjects = req.body.teamProjects;

            team.save().then(team => {
                res.json('Team updated!');
            }).catch(err => {
                    res.status(400).send("Update not possible");
            });
        }
    });
});

/* Get all users */
userRoutes.route('/').get(function(req, res) {
    Users.find(function(err, users) {
        if (err) {
            console.log(err);
        } else {
            res.json(users);
        }
    });
});

/* Get user by Id */
userRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Users.findById(id, function(err, user) {
        res.json(user);
    });
});

/* Add user */
userRoutes.route('/add').post(function(req, res) {
    let user = new Users(req.body);
    user.save()
        .then(user => {
            res.status(200).json({'user': 'user added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new user failed');
        });
});

/* Update organization */
userRoutes.route('/update/:id').post(function(req, res) {
    Users.findById(req.params.id, function(err, user) {
        if (!user) {
            res.status(404).send("data is not found");
        } else {
            user.name = req.body.name;
            user.username = req.body.username;
            user.email = req.body.email;
            user.password = req.body.password;
            user.organizations = req.body.organizations;

            user.save().then(user => {
                res.json('User updated!');
            }).catch(err => {
                res.status(400).send("Update not possible");
            });
        }
    });
});

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});