import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../actions/authActions";
import {Link} from "react-router-dom";

class Profile extends Component {

    componentDidMount() {
        const { match: { params } } = this.props;
        const { user } = this.props.auth;

        if (user.id !== params.id) {
            this.props.history.push("/login");
        }
    }

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    render() {
        const { user } = this.props.auth;

        let teams = "/teams/";
        teams = teams.concat(user.id.toString());

        return (
            <div>
                <p>{user.name}</p>
                <Link to={teams}>
                    My Teams
                </Link>
                <button onClick={this.onLogoutClick} className="btn btn-primary">
                    Logout
                </button>
            </div>
        )
    }
}

Profile.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(Profile);