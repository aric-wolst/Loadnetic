import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {Link} from "react-router-dom";

class Teams extends Component {

    componentDidMount() {
        const { match: { params } } = this.props;

        if (this.props.auth.user.id !== params.id) {
            this.props.history.push("/login");
        }
    }

    render() {
        const { user } = this.props.auth;

        let createTeam = "/createTeam/";
        createTeam = createTeam.concat(user.id.toString());

        return (
            <div>
                <p>{user.name}'s Teams</p>

                <Link to={createTeam}>
                    Create a New Team
                </Link>

            </div>
        )
    }
}

Teams.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
)(Teams);