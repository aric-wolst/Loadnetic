import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import classnames from "classnames";
import {logoutUser} from "../actions/authActions";
import {setCurrentTeam} from "../actions/teamActions";
import {setCurrentProject} from "../actions/projectActions";
const Validator = require("validator");

//Page that creates a team
 class CreateTeam extends Component {

    constructor(props) {
        super(props);

        this.onChangeTeamName = this.onChangeTeamName.bind(this);
        this.onChangeTeamDescription = this.onChangeTeamDescription.bind(this);
        this.onChangeTeamSize = this.onChangeTeamSize.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            teamName: '',
            teamDescription: '',
            teamSize: '1',
            teamAdminId: [''],
            teamMemberId: [''],
            errors: {}
        }
    }

     componentDidMount() {

         let null_data = {};
         this.props.setCurrentTeam(null_data);
         this.props.setCurrentProject(null_data);

         const { match: { params } } = this.props;

         if (this.props.auth.user.id !== params.id) {
             this.props.history.push("/login");
         } else {
             this.setState({
                 teamAdminId: [this.props.auth.user.id],
                 teamMemberId: [this.props.auth.user.id]
             });
         }
     }

    onChangeTeamName(name) {
        this.setState({
            teamName: name.target.value
        });
    }

    onChangeTeamDescription(desc) {
        this.setState({
            teamDescription: desc.target.value
        });
    }

    onChangeTeamSize (size) {
        this.setState({
            teamSize: size.target.value
        });
    }

    validateForm(){
        let isValid = true;
        let error = {};

        if(Validator.isEmpty(this.state.teamName)){
            error.teamName =  "Name field is required";

            isValid = false;
        }

        if(Validator.isEmpty(this.state.teamDescription)){
            error.teamDescription =  "Description field is required";

            isValid = false;
        }

        this.setState({
            errors: error
        });

        return isValid;
    };

    onSubmit(e) {

        //Stops page from reloading on submit
        e.preventDefault();

        if(this.validateForm()) {

            const newTeam = {
                teamName: this.state.teamName,
                teamDescription: this.state.teamDescription,
                teamSize: this.state.teamSize,
                teamAdminId: this.state.teamAdminId,
                teamMemberId: this.state.teamMemberId
            };


            let route = "http://localhost:4000/users/addTeam/";
            route = route.concat(this.props.auth.user.id.toString());

            axios.post(route, newTeam)
                .then(res => {

                    let teams = "/teams/";
                    let id = this.props.auth.user.id.toString();
                    let teamsPath = teams.concat(id);

                    this.props.history.push(teamsPath);

                }).catch(err => {

                    const error = {};
                    error.user = err;

                    this.setState({
                        errors: error
                    });
                });

            this.setState({
                teamName: '',
                teamDescription: '',
                teamSize: '1'
            })
        }
    }

    render() {
        let cancel = "/teams/";
        cancel = cancel.concat(this.props.auth.user.id.toString());

        return (
            <div>
                <div className="container">
                    <h3>Create a New Team</h3>
                    <form onSubmit={this.onSubmit} name={"form"}>
                        <div className="form-group">
                            <label>Team Name: </label>
                            <input  name = "name"
                                    type="text"
                                    value={this.state.teamName}
                                    error={this.state.errors.teamName}
                                    onChange={this.onChangeTeamName}
                                    className={classnames("", {
                                        invalid: this.state.errors.teamName
                                    })}
                            />
                            <span className="red-text">
                                {this.state.errors.teamName}
                            </span>
                        </div>
                        <div className="form-group">
                            <label>Description: </label>
                            <input
                                name = "desc"
                                type="text"
                                value={this.state.teamDescription}
                                error={this.state.errors.teamDescription}
                                onChange={this.onChangeTeamDescription}
                                className={classnames("", {
                                    invalid: this.state.errors.teamDescription
                                })}
                            />
                            <span className="red-text">
                                {this.state.errors.teamDescription}
                            </span>
                        </div>
                        <div className="form-group">
                            <label>Team Size: </label>
                            <select value={this.state.teamSize} onChange={this.onChangeTeamSize}>
                                <option value="1">1</option>
                                <option value="4">4</option>
                                <option value="8">8</option>
                                <option value="12">12</option>
                                <option value="16">16</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <input type="submit" value="Create Team" className="btn btn-primary" />
                        </div>
                    </form>
                    <span className="red-text">
                        {this.state.errors.user}
                    </span>
                    <span className="red-text">
                        {this.state.errors.team}
                    </span>
                    <Link to={cancel}>
                        Cancel
                    </Link>
                </div>
            </div>
        )
    }
}

CreateTeam.propTypes = {
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
)(CreateTeam);