const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require("passport");

const users = require("./routes/api/users");
const loadnetic = require("./routes/api/loadnetic");
const projects = require("./routes/api/projects");

const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const db = require("./config/keys").mongoURI;

/* Connect to mongo */
mongoose.connect(db, { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
});

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes
app.use("/users", users);
app.use("/loadnetic", loadnetic);
app.use("/projects", projects);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});