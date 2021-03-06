import React, { Component } from 'react';
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../actions/authActions";
import classnames from "classnames";
import {setCurrentTeam} from "../actions/teamActions";
import {setCurrentProject} from "../actions/projectActions";

class Login extends Component {

    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            errors: {}
        };
    }

    componentDidMount() {

        let null_data = {};
        this.props.setCurrentTeam(null_data);
        this.props.setCurrentProject(null_data);

        // If logged in and user navigates to Login page, should redirect them to their teams
        if (this.props.auth.isAuthenticated) {
            let teams = "/teams/";
            let id = this.props.auth.user.id.toString();
            let teamsPath = teams.concat(id);
            this.props.history.push(teamsPath);
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {

        if (nextProps.auth.isAuthenticated) {
            let teams = "/teams/";
            let id = nextProps.auth.user.id.toString();
            let teamsPath = teams.concat(id);
            this.props.history.push(teamsPath);
        }

        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    };

    onChange = e => {
        this.setState({
            [e.target.id]: e.target.value });
    };

    onSubmit = e => {

        //Prevent page reload
        e.preventDefault();

        const userData = {
            email: this.state.email,
            password: this.state.password
        };

        this.props.loginUser(userData);
    };

    render() {
        return (
            <div>
                <div className="container">
                    <h3>Login</h3>
                    <form noValidate onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email </label>
                            <input
                                onChange={this.onChange}
                                value={this.state.email}
                                error={this.state.errors.email}
                                id="email"
                                type="email"
                                className={classnames("", {
                                invalid: this.state.errors.email || this.state.errors.emailnotfound
                            })}
                            />
                            <span className="red-text">
                                {this.state.errors.email}
                                {this.state.errors.emailnotfound}
                            </span>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password </label>
                            <input
                                onChange={this.onChange}
                                value={this.state.password}
                                error={this.state.errors.password}
                                id="password"
                                type="password"
                                className={classnames(" ", {
                                    invalid: this.state.errors.password || this.state.errors.passwordincorrect
                                })}
                            />
                            <span className="red-text">
                                {this.state.errors.password}
                                {this.state.errors.passwordincorrect}
                            </span>
                        </div>
                        <div className="form-group">
                            <input type="submit" value="Login" className="btn btn-primary" />
                        </div>
                    </form>
                    <p>
                        Don't have an account? <Link to="/register">Register</Link>
                    </p>
                </div>
            </div>
        )
    }
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    team: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    setCurrentTeam: PropTypes.func.isRequired,
    setCurrentProject: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors,
    team: state.team,
    project: state.project
});

export default connect(
    mapStateToProps,
    { loginUser, setCurrentTeam, setCurrentProject }
)(Login);