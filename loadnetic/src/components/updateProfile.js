import React, { Component } from 'react';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {postRoute, updateCurrentUser} from "../actions/authActions";

class updateProfile extends Component {

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            name: '',
            email: ''
        }
    }

    componentDidMount() {
        const { match: { params } } = this.props;
        const { user } = this.props.auth;

        if (user.id !== params.id) {
            this.props.history.push("/login");
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.auth.isAuthenticated) {
            let teams = "/profile/";
            let id = nextProps.auth.user.id.toString();
            let teamsPath = teams.concat(id);
            this.props.history.push(teamsPath);
        }
    }

    onChange(e) {
        this.setState({
            [e.target.id]: e.target.value
        })
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

        this.props.updateCurrentUser(user, postRoute);
    }

    render() {
        const { user } = this.props.auth;

        return (
            <div>
                <p> Update {user.name}'s Profile </p>
                <form onSubmit={this.onSubmit} name={"form"}>
                    <div className="form-group">
                        <label>Name: </label>
                        <input  name = "name"
                                id = "name"
                                type="text"
                                value={this.state.name}
                                onChange={this.onChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email: </label>
                        <input  name = "email"
                                id = "email"
                                type="text"
                                value={this.state.email}
                                onChange={this.onChange}
                        />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Update" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}

updateProfile.propTypes = {
    updateCurrentUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { updateCurrentUser }
)(updateProfile);