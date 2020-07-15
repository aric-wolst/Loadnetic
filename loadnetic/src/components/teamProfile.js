import React, { Component } from 'react';
import {Link} from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import "../componets-css/teamProfile.css";
import TeamMembers from "../teamProfile_components/TeamMembers";
import ProjectList from "../teamProfile_components/ProjectList";
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
            team: {},
            errors: {},
            newUserEmail: '',
            newUserAdmin: false
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
            return <ProjectList project={currentProject} key={i} />;
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

        const { match: { params } } = this.props;

        const data = {
            admin: this.state.newUserAdmin,
            email: this.state.newUserEmail
        };

        let request = "http://localhost:4000/loadnetic/addMember/";
        request = request.concat(params.teamId, '/', this.props.auth.user.id);

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
                    <h4>
                        <Link to={newProject}>
                            New Project
                        </Link>
                    </h4>
                    <h4>Team Members</h4>
                        {this.teamList(this.state.isAdmin, params.teamId.toString())}
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
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
)(TeamProfile);