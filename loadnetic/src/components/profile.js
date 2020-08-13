import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../actions/authActions";
import {Link} from "react-router-dom";
import {setCurrentTeam} from "../actions/teamActions";
import {setCurrentProject} from "../actions/projectActions";

class Profile extends Component {

    componentDidMount() {

        const { match: { params } } = this.props;

        let null_data = {};
        this.props.setCurrentTeam(null_data);
        this.props.setCurrentProject(null_data);

        if (this.props.auth.user.id !== params.id) {
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

        let update = "/profile/";
        update = update.concat(user.id.toString(),"/update");

        return (
            <div>
                <div className="container">
                    <h3>{user.name}</h3>
                    <h4>{user.email}</h4>
                    <div>
                        <Link to={teams}>
                            My Teams
                        </Link>
                    </div>
                    <div>
                        <Link to={update}>
                            Update Profile
                        </Link>
                    </div>
                    <div>
                        <button onClick={this.onLogoutClick} className="btn btn-primary">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

Profile.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    team: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    setCurrentTeam: PropTypes.func.isRequired,
    setCurrentProject: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    team: state.team,
    project: state.project
});

export default connect(
    mapStateToProps,
    { logoutUser, setCurrentTeam, setCurrentProject }
)(Profile);