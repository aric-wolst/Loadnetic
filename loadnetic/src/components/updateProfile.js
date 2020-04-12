import React, { Component } from 'react';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {updateCurrentUser, logoutUser} from "../actions/authActions";
import {Link} from "react-router-dom";
import classnames from "classnames";
const isEmpty = require("is-empty");

class updateProfile extends Component {

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            name: '',
            email: '',
            errors: {}
        }
    }

    componentDidMount() {
        const { match: { params } } = this.props;
        const { user } = this.props.auth;

        if (user.id !== params.id) {
            this.props.history.push("/login");
        } else {
            this.setState({
                email: user.email,
                name: user.name
            });
        }
    }

    onChange(e) {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (!isEmpty(nextProps.errors)) {
            this.setState({
                errors: nextProps.errors
            });
        } else {
            this.props.logoutUser()
        }
    };

    onSubmit(e) {

        //Stops page from reloading on submit
        e.preventDefault();

        const user = {
            id: this.props.auth.user.id,
            name: this.state.name,
            email: this.state.email,
            iat: this.props.auth.user.iat,
            exp: this.props.auth.user.exp
        };

        let postRoute = 'http://localhost:4000/users/update/';
        postRoute = postRoute.concat(user.id.toString());

        this.props.updateCurrentUser(user, postRoute);

    }

    render() {
        const { user } = this.props.auth;

        let cancel = "/profile/";
        cancel = cancel.concat(user.id.toString());

        return (
            <div>
                <p> Update {user.name}'s Profile </p>
                <form onSubmit={this.onSubmit} name={"form"}>
                    <div className="form-group">
                        <label>Name: </label>
                        <input  name = "name"
                                id = "name"
                                type="text"
                                error={this.state.errors.name}
                                value={this.state.name}
                                onChange={this.onChange}
                                className={classnames("", {
                                    invalid: this.state.errors.name
                                })}
                        />
                        <span className="red-text">
                            {this.state.errors.name}
                        </span>
                    </div>
                    <div className="form-group">
                        <label>Email: </label>
                        <input  name = "email"
                                id = "email"
                                type="text"
                                error={this.state.errors.email}
                                value={this.state.email}
                                onChange={this.onChange}
                                className={classnames("", {
                                    invalid: this.state.errors.email
                                })}
                        />
                        <span className="red-text">
                            {this.state.errors.email}
                        </span>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Update" className="btn btn-primary" />
                    </div>
                </form>
                <Link to={cancel}>
                    Cancel
                </Link>
            </div>
        )
    }
}

updateProfile.propTypes = {
    updateCurrentUser: PropTypes.func.isRequired,
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { updateCurrentUser, logoutUser }
)(updateProfile);