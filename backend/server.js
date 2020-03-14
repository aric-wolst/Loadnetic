const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const loadneticRoutes = express.Router();
const PORT = 4000;

let Teams = require('./loadnetic.model');

app.use(cors());
app.use(bodyParser.json());
app.use('/todos', loadneticRoutes);

mongoose.connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
});

loadneticRoutes.route('/').get(function(req, res) {
    Teams.find(function(err, loadnetic) {
        if (err) {
            console.log(err);
        } else {
            res.json(loadnetic);
        }
    });
});

loadneticRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Teams.findById(id, function(err, loadnetic) {
        res.json(loadnetic);
    });
});

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

loadneticRoutes.route('/update/:id').post(function(req, res) {
    Teams.findById(req.params.id, function(err, team) {
        if (!team) {
            res.status(404).send("data is not found");
        } else {
            team.teamName = req.body.teamName;
            team.teamDescription = req.body.teamDescription;
            team.teamSize = req.body.teamSize;
            team.teamCreatorId = req.body.teamCreatorId;

            team.save().then(team => {
                res.json('Team updated!');
            }).catch(err => {
                    res.status(400).send("Update not possible");
            });
        }
    });
});

app.use('/loadnetic', loadneticRoutes);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});