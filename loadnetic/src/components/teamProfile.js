import React, { Component } from 'react';
import {Link} from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import "../componets-css/teamProfile.css";
import classnames from "classnames";
const Validator = require("validator");

let projectProfile = "/project/";

const Project = props => (
    <div className="col-4">
        <h4> <a href={projectProfile.concat(props.project._id)}>{props.project.projectName}</a></h4>
        <p>{props.project.projectDescription}</p>
    </div>
);

const Team = props => (
    <tr>
        <th class="col-3">{props.team.name}</th>
        <th class="col-3">{props.team.email}</th>
        {props.team.admin === true ? <th class="col=2"> Admin </th> : <th class="col=4"></th>}
        {(props.user === true) ?
            ( props.team.admin === true ?
                <th class="col-2">
                    <button className="btn btn-primary"> Demote </button>
                </th> :
                <th className="col-2">
                    <button className="btn btn-primary"> Promote </button>
                </th>)
            : <th class="col-2"></th>
        }
        {(props.user === true) ?
            <th class="col-2"><button className="btn btn-primary" > Remove </button></th>
            : <th class="col-2"></th>
        }
    </tr>
);

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

                                console.log(this.state.teamMembers)
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
        request = request.concat(params.teamId);

        if(this.validateNewUser()){
            axios.post(request, data)
                .catch(err => {

                    const error = {};
                    error.newUser = err.response.data;

                    this.setState({
                        errors: error
                    });
                });

            this.setState({
                newUserEmail: '',
                newUserAdmin: false
            })

            window.location.reload();
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
                    <Link to={newProject}>
                        New Project
                    </Link>
                    <h4>Team Members</h4>
                    <table>
                        <tbody>
                            {this.teamList(this.state.isAdmin)}
                        </tbody>
                    </table>
                    <form onSubmit={this.onSubmit} name={"form"}>
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

                        <div className="form-group">
                            <label>Admin </label>
                            <select value={this.state.newUserAdmin} onChange={this.onChangeNewUserAdmin}>
                                <option value="false">No</option>
                                <option value="true">Yes</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <input type="submit" value="Add User" className="btn btn-primary" />
                        </div>
                        <span className="red-text">
                                {this.state.errors.newUser}
                        </span>
                    </form>
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