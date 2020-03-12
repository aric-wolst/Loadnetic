import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class App extends Component {
    render() {
        return (
            <Router>
                <Route path="/" exact component={Landing} />
                <Route path="/teams/:id" component={Teams} />
                <Route path="/projects/:team" component={Projects} />
                <div className="container">
                    <h2>Loadnetic</h2>
                </div>
            </Router>
        );
    }
}

export default App;