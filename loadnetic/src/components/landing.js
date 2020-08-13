import React, { Component } from 'react';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {logoutUser} from "../actions/authActions";
import {setCurrentTeam} from "../actions/teamActions";
import {setCurrentProject} from "../actions/projectActions";

class Landing extends Component {

    componentDidMount() {
        let null_data = {};
        this.props.setCurrentTeam(null_data);
        this.props.setCurrentProject(null_data);
    }

    render() {
        return (
            <div>
                <div className="container">
                    <h3>Welcome to Loadnetic!</h3>
                </div>
            </div>
        )
    }
}

Landing.propTypes = {
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
    { setCurrentTeam, setCurrentProject }
)(Landing);