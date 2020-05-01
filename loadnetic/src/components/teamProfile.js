import React, { Component } from 'react';
import {Link} from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import {connect} from "react-redux";

let projectProfile = "/project/";

const Project = props => (
    <div class="col-4">
        <h4> <a href={projectProfile.concat(props.project._id)}>{props.project.projectName}</a></h4>
        <p>{props.project.projectDescription}</p>
    </div>
);

class TeamProfile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            projects: [],
            errors: {}
        }
    }

    componentDidMount() {
        const { match: { params } } = this.props;

        let hasTeamsRoute = "http://localhost:4000/users/hasTeam/";
        hasTeamsRoute = hasTeamsRoute.concat(this.props.auth.user.id.toString(), "/", params.teamId);

        axios.get(hasTeamsRoute)
            .then(hasTeam => {
                if(hasTeam.data === false) {
                    this.props.history.push("/login");

                } else {
                    let getProjectsRoute = "http://localhost:4000/loadnetic/getProjects/";
                    getProjectsRoute = getProjectsRoute.concat(params.teamId);

                    axios.get(getProjectsRoute)
                        .then(teamProjects => {

                            this.setState({
                                projects: teamProjects.data
                            });
                        })
                }
            });
    }

    projectsList() {
        return this.state.projects.map(function(currentProject, i){
            return <Project project={currentProject} key={i} />;
        })
    }

    render() {
        const { match: { params } } = this.props;
        let newProject = "/createProject/";
        newProject = newProject.concat(params.teamId.toString());

        return (
            <div>
                <div class="container">
                    <h3>Team Profile</h3>
                    <div className="row">
                        { this.projectsList() }
                    </div>
                    <Link to={newProject}>
                        New Project
                    </Link>
                </div>
            </div>
        )
    }
}

TeamProfile.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
)(TeamProfile);