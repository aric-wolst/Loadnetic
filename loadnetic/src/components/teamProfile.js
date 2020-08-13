import React, { Component } from 'react';
import {Link} from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import "../componets-css/teamProfile.css";
import TeamMembers from "../teamProfile_components/TeamMembers";
import ProjectList from "../teamProfile_components/ProjectList";
import {setCurrentTeam} from "../actions/teamActions";
const Validator = require("validator");

class TeamProfile extends Component {

    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeNewUserEmail = this.onChangeNewUserEmail.bind(this);
        this.onChangeNewUserAdmin = this.onChangeNewUserAdmin.bind(this);

        this.state = {
            projects: [],
            teamMembers: [],
            isAdmin: false,
            errors: {},
            newUserEmail: '',
            newUserAdmin: false
        }
    }

    componentDidMount() {

        const { match: { params } } = this.props;

        let hasTeamsRoute = "http://localhost:4000/users/hasTeam/";
        hasTeamsRoute = hasTeamsRoute.concat(this.props.auth.user.id, "/", params.teamId);

        axios.get(hasTeamsRoute)
            .then(ret => {

                if(ret.data.hasTeam === false) {
                    this.props.history.push("/login");

                } else {

                    let null_data = {};
                    this.props.setCurrentProject(null_data);

                    this.props.setCurrentTeam(ret.data.team);

                    const projects = [];
                    let userProjects = this.props.team.team.teamProjects;
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
                    let teamMembers = this.props.team.team.teamMemberId;
                    let teamAdmins = this.props.team.team.teamAdminId;

                    if(teamAdmins.includes(this.props.auth.user.id)){
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
        let teamId = this.props.team.team._id;

        return this.state.projects.map(function(currentProject, i){
            return <ProjectList project={currentProject} team={teamId} key={i} />;
        })
    }

    teamList = (admin, teamId) => {
        return this.state.teamMembers.map(function(member, i){
            return <TeamMembers team={member} key={i} user={admin} teamId={teamId} num={i}/>
        })
    };

    onChangeNewUserEmail(email) {
        this.setState({
            newUserEmail: email.target.value.trim()
        })
    }

    onChangeNewUserAdmin(admin) {
        this.setState({
            newUserAdmin: admin.target.value === "true"
        })
    }

    validateNewUser() {
        let isValid = true;
        let error = {};

        if(!Validator.isEmail(this.state.newUserEmail)){
            error.newUserEmail =  "Email is invalid";

            isValid = false;
        }

        if(Validator.isEmpty(this.state.newUserEmail)){
            error.newUserEmail =  "Email field is required";

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

        const data = {
            admin: this.state.newUserAdmin,
            email: this.state.newUserEmail
        };

        let request = "http://localhost:4000/loadnetic/addMember/";
        request = request.concat(this.props.team.team._id, '/', this.props.auth.user.id);

        if(this.validateNewUser()){
            axios.post(request, data)
                .then( function () {
                    window.location.reload()
                })
                .catch(err => {
                    console.log(err);
                    const error = {};
                    error.newUser = err.response.data;

                    this.setState({
                        errors: error
                    });
                });
        }
    }

    render() {
        let newProject = "/createProject/";
        newProject = newProject.concat(this.props.team.team._id);

        return (
            <div>
                <div className="container">
                    <h3>{this.props.team.team.teamName}</h3>
                    <h5>{this.props.team.team.teamDescription}</h5>
                    <h4>Projects</h4>
                    <div className="row">
                        { this.projectsList() }
                    </div>
                    <h4>
                        <Link to={newProject}>
                            New Project
                        </Link>
                    </h4>
                    <h4>Team Members</h4>
                        {this.teamList(this.state.isAdmin, this.props.team.team._id)}
                    {this.state.isAdmin === true ?
                        (<form onSubmit={this.onSubmit} name={"form"}>
                            <div className={"row"}>
                                <div className={"col-4"}><h5>Add Team Member</h5></div>
                                <div className={"col-4"}>
                                    <div className="form-group">
                                        <label>Email </label>
                                        <input  name = "newUserEmail"
                                                id = "newUserEmail"
                                                type="text"
                                                error={this.state.errors.newUserEmail}
                                                value={this.state.newUserEmail}
                                                onChange={this.onChangeNewUserEmail}
                                        />
                                        <span className="red-text">
                                            {this.state.errors.newUserEmail}
                                        </span>
                                    </div>
                                </div>

                                <div className={"col-2"}>
                                    <div className={"float-right"}>
                                        <div className="form-group">
                                            <label>Admin </label>
                                            <select value={this.state.newUserAdmin} onChange={this.onChangeNewUserAdmin}>
                                                <option value="false">No</option>
                                                <option value="true">Yes</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className={"col-2"}>
                                    <div className={"float-right"}>
                                        <div className="form-group">
                                            <input type="submit" value="Add User" className="btn btn-primary" />
                                        </div>
                                        <span className="red-text">
                                            {this.state.errors.newUser}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </form>)
                    :   <div/>}
                </div>
            </div>
        )
    }
}

TeamProfile.propTypes = {
    auth: PropTypes.object.isRequired,
    team: PropTypes.object.isRequired,
    setCurrentTeam: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    team: state.team
});

export default connect(
    mapStateToProps,
    { setCurrentTeam }
)(TeamProfile);