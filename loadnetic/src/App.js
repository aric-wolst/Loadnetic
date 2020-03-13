import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Landing from "./components/landing.js";
import Projects from "./components/projects.js";
import Teams from "./components/teams.js";
import Profile from "./components/profile.js";
import CreateTeam from "./components/createTeam";
import "./App.css";


class App extends Component {
    render() {
        return (
            <Router>
                <div className="top">
                    <div className="row">
                        <div className="col">
                            <Link to="/" className="loadnetic">
                                Loadnetic
                            </Link>
                        </div>
                        <Link to="/profile/:id" className="col" id="nameCol">
                            First Last
                        </Link>
                    </div>
                </div>
                <Route path="/" exact component={Landing} />
                <Route path="/teams/:id" component={Teams} />
                <Route path="/createTeam/:id" component={CreateTeam} />
                <Route path="/projects/:team" component={Projects} />
                <Route path="/profile/:id" component={Profile} />
            </Router>
        );
    }
}

export default App;