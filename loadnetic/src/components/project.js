import React, { Component } from 'react';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {setCurrentTeam} from "../actions/teamActions";
import {setCurrentProject} from "../actions/projectActions";
import axios from "axios";

class Project extends Component {

    componentDidMount() {
        const { match: { params } } = this.props;

        let hasTeamsRoute = "http://localhost:4000/users/hasTeam/";
        hasTeamsRoute = hasTeamsRoute.concat(this.props.auth.user.id, "/", params.teamId);

        axios.get(hasTeamsRoute)
            .then(ret => {

                if (!ret.data.hasTeam) {

                    this.props.history.push("/login");

                } else {

                    let hasProjectRoute = "http://localhost:4000/loadnetic/hasProject/";
                    hasProjectRoute = hasProjectRoute.concat(this.props.auth.user.id, "/", params.teamId, "/", params.projectId);

                    axios.get(hasProjectRoute)
                        .then(retVal => {

                            if(!retVal.data.hasProject) {

                                this.props.history.push("/login");

                            } else {

                                this.props.setCurrentTeam(ret.data.team);

                                this.props.setCurrentProject(retVal.data.project);

                            }
                        })
                }
            }).catch(err => {

        });
    }

    render() {
        return (
            <div>
                <div className="container">
                    <h3>Project Profile</h3>
                </div>
            </div>
        )
    }
}

Project.propTypes = {
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
)(Project);