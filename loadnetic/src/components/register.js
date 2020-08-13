import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {registerUser} from "../actions/authActions";
import classnames from "classnames";
import {setCurrentTeam} from "../actions/teamActions";
import {setCurrentProject} from "../actions/projectActions";

class Register extends Component {

    constructor() {
        super();
        this.state = {
            name: "",
            email: "",
            password: "",
            password2: "",
            errors: {}
        };
    }

    componentDidMount() {

        let null_data = {};
        this.props.setCurrentTeam(null_data);
        this.props.setCurrentProject(null_data);

        // If logged in and user navigates to Register page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
            let teams = "/teams/";
            let id = this.props.auth.user.id.toString();
            let teamsPath = teams.concat(id);
            this.props.history.push(teamsPath);
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    onSubmit = e => {

        //Prevent page reload
        e.preventDefault();

        const newUser = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password2: this.state.password2
        };

        this.props.registerUser(newUser, this.props.history);
    };

    render() {
        return (
            <div>
                <div className="container">
                    <h3>Register</h3>
                    <form noValidate onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <input
                                onChange={this.onChange}
                                value={this.state.name}
                                error={this.state.errors.name}
                                id="name"
                                type="text"
                                className={classnames("", {
                                    invalid: this.state.errors.name
                                })}
                            />
                            <label htmlFor="name">Name</label>
                            <span className="red-text">{this.state.errors.name}</span>
                        </div>
                        <div className="form-group">
                            <input
                                onChange={this.onChange}
                                value={this.state.email}
                                error={this.state.errors.email}
                                id="email"
                                type="email"
                                className={classnames("", {
                                    invalid: this.state.errors.email
                                })}
                            />
                            <label htmlFor="email">Email</label>
                            <span className="red-text">{this.state.errors.email}</span>
                        </div>
                        <div className="form-group">
                            <input
                                onChange={this.onChange}
                                value={this.state.password}
                                error={this.state.errors.password}
                                id="password"
                                type="password"
                                className={classnames("", {
                                    invalid: this.state.errors.password
                                })}
                            />
                            <label htmlFor="password">Password</label>
                            <span className="red-text">{this.state.errors.password}</span>
                        </div>
                        <div className="form-group">
                            <input
                                onChange={this.onChange}
                                value={this.state.password2}
                                error={this.state.errors.password2}
                                id="password2"
                                type="password"
                                className={classnames("", {
                                    invalid: this.state.errors.password2
                                })}
                            />
                            <label htmlFor="password2">Confirm Password</label>
                            <span className="red-text">{this.state.errors.password2}</span>
                        </div>
                        <div className="form-group">
                            <input type="submit" value="Register" className="btn btn-primary" />
                        </div>
                    </form>
                    <p>
                        Already have an account? <Link to="/login">Log in</Link>
                    </p>
                </div>
            </div>
        )
    }
}

Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
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
    { registerUser, setCurrentTeam, setCurrentProject }
)(withRouter(Register));