import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import { Provider } from "react-redux";
import store from "./store";

import Landing from "./components/landing.js";
import Projects from "./components/projects.js";
import Teams from "./components/teams.js";
import Profile from "./components/profile.js";
import CreateTeam from "./components/createTeam";
import "./App.css";
import Register from "./components/register";
import Login from "./components/login";
import PrivateRoute from "./private-route/PrivateRoute";
import PrivateLink from "./private-route/PrivateLink";

// Check for token to keep user logged in
if (localStorage.jwtToken) {

    // Set auth token header auth
    const token = localStorage.jwtToken;
    setAuthToken(token);

    // Decode token and get user info and exp
    const decoded = jwt_decode(token);

    // Set user and isAuthenticated
    store.dispatch(setCurrentUser(decoded));

    // Check for expired token
    const currentTime = Date.now() / 1000; // to get in milliseconds
    if (decoded.exp < currentTime) {
        // Logout user
        store.dispatch(logoutUser());
        // Redirect to login
        window.location.href = "./login";
    }
}


class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router>
                    <div className="top">
                        <div className="row">
                            <div className="col">
                                <Link to="/" className="loadnetic">
                                    Loadnetic
                                </Link>
                            </div>
                            <PrivateLink/>
                        </div>
                    </div>
                    <Route path="/" exact component={Landing} />
                    <Switch>
                        <PrivateRoute exact path="/teams/:id" component={Teams}/>
                        <PrivateRoute exact path="/createTeam/:id" component={CreateTeam} />
                        <PrivateRoute exact path="/projects/:team" component={Projects} />
                        <PrivateRoute exact path="/profile/:id" component={Profile} />
                    </Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                </Router>
            </Provider>
        );
    }
}

export default App;