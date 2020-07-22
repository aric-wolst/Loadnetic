import React, { Component } from 'react';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {updateCurrentUser, logoutUser} from "../actions/authActions";
import {Link} from "react-router-dom";
import classnames from "classnames";
const Validator = require("validator");

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

        if (this.props.auth.user.id !== params.id) {

            this.props.history.push("/login");

        } else {

            this.setState({
                email: this.props.auth.user.email,
                name: this.props.auth.user.name
            });
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {

        if (nextProps.errors.email) {

            this.setState({
                errors: nextProps.errors
            });

        } else {

            this.setState({
                errors: {}
            });

            let path = "/profile/";

            this.props.history.push(path.concat(this.props.auth.user.id));
        }
    };

    onChange(e) {
        this.setState({
            [e.target.id]: e.target.value.trim()
        })
    }

    validate() {
        let isValid = true;
        let error = {};

        if(!Validator.isEmail(this.state.email)){
            error.email =  "Email is invalid";

            isValid = false;
        }

        if(Validator.isEmpty(this.state.name)){
            error.name =  "Name field is required";

            isValid = false;
        }

        if(Validator.isEmpty(this.state.email)){
            error.email =  "Email field is required";

            isValid = false;
        }

        this.setState({
            errors: error
        });

        return isValid;
    }

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

        if(this.validate()) {

            this.props.updateCurrentUser(user, postRoute)
        }

    }

    render() {
        const { user } = this.props.auth;

        let cancel = "/profile/";
        cancel = cancel.concat(user.id.toString());

        return (
            <div>
                <div className="container">
                    <h3> Update {user.name}'s Profile </h3>
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