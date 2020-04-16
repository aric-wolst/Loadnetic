import React, { Component } from 'react';
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../actions/authActions";
import classnames from "classnames";

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
                <h3>Login</h3>
                <form noValidate onSubmit={this.onSubmit}>
                    <div className="form-group">
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
                        <label htmlFor="email">Email</label>
                        <span className="red-text">
                            {this.state.errors.email}
                            {this.state.errors.emailnotfound}
                        </span>
                    </div>
                    <div className="form-group">
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
                        <label htmlFor="password">Password</label>
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
        )
    }
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { loginUser }
)(Login);