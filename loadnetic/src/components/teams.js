import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../actions/authActions";

class Teams extends Component {
    render() {
        const { user } = this.props.auth;

        return (
            <div>
                <p>{user.name}'s Teams</p>
            </div>
        )
    }
}

Teams.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(Teams);