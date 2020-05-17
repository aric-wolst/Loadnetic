import React, { Component } from 'react';
import {Link} from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import "../componets-css/teamProfile.css";

let projectProfile = "/project/";

const Project = props => (
    <div className="col-4">
        <h4> <a href={projectProfile.concat(props.project._id)}>{props.project.projectName}</a></h4>
        <p>{props.project.projectDescription}</p>
    </div>
);

const Team = props => (
    <tr>
        <th class="col-4">{props.team.name}</th>
        <th class="col-4">{props.team.email}</th>
        <th class="col-4"><Link id={props.user === true ? (props.team.admin === true ? "adminDemote" : "adminPromote") : ""}></Link></th>
    </tr>
);

class TeamProfile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            projects: [],
            teamMembers: [],
            isAdmin: false,
            team: {},
            errors: {}
        }
    }

    componentDidMount() {
        const { match: { params } } = this.props;

        let hasTeamsRoute = "http://localhost:4000/users/hasTeam/";
        hasTeamsRoute = hasTeamsRoute.concat(this.props.auth.user.id.toString(), "/", params.teamId);

        axios.get(hasTeamsRoute)
            .then(ret => {

                if(ret.data.hasTeam === false) {
                    this.props.history.push("/login");

                } else {
                    this.setState({
                        team: ret.data.team,
                    });

                    const projects = [];
                    let userProjects = this.state.team.teamProjects;
                    let request = "http://localhost:4000/projects/";

                    for (let i = 0; i < userProjects.length; i++) {
                        axios.get(request.concat(userProjects[i]))
                            .then(project => {
                                projects.push(project.data);

                                this.setState({
                                    projects: projects
                                });
                            });
                    }

                    const users = [];
                    let teamMembers = this.state.team.teamMemberId;
                    let teamAdmins = this.state.team.teamAdminId;

                    if(teamAdmins.includes(this.props.auth.user.id.toString())){
                        this.setState({
                            isAdmin: true
                        });
                    }

                    let userRequest = "http://localhost:4000/users/nameAndEmail/";

                    for (let i = 0; i < teamMembers.length; i++) {
                        axios.get(userRequest.concat(teamMembers[i]))
                            .then(retUser => {

                                let user = {};

                                user.name = retUser.data.name;
                                user.email = retUser.data.email;

                                user.admin = teamAdmins.includes(teamMembers[i]) === true;
                                users.push(user);

                                this.setState({
                                    teamMembers: users
                                });
                            });
                    }
                }
            });
    }

    projectsList() {
        return this.state.projects.map(function(currentProject, i){
            return <Project project={currentProject} key={i} />;
        })
    }

    teamList = (admin) => {
        return this.state.teamMembers.map(function(member, i){
            return <Team team={member} key={i} user={admin}/>
        })
    };

    render() {
        const { match: { params } } = this.props;
        let newProject = "/createProject/";
        newProject = newProject.concat(params.teamId.toString());

        return (
            <div>
                <div className="container">
                    <h3>{this.state.team.teamName}</h3>
                    <h4>Projects</h4>
                    <div className="row">
                        { this.projectsList() }
                    </div>
                    <Link to={newProject}>
                        New Project
                    </Link>
                    <h4>Team Members</h4>
                        <table>
                            {this.teamList(this.state.isAdmin)}
                        </table>
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