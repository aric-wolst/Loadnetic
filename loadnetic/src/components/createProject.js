import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import classnames from "classnames";
const Validator = require("validator");

//Page that creates a team
class CreateProject extends Component {

    constructor(props) {
        super(props);

        this.onChangeProjectName = this.onChangeProjectName.bind(this);
        this.onChangeProjectDescription = this.onChangeProjectDescription.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            projectName: '',
            projectDescription: '',
            projectAdminId: [''],
            projectMemberId: [''],
            errors: {}
        }
    }

    componentDidMount() {
        const { match: { params } } = this.props;
        let route = "http://localhost:4000/users/hasTeam/";
        route = route.concat(this.props.auth.user.id.toString(), "/", params.teamId);
        axios.get(route)
            .then(hasTeam => {
                if (hasTeam.data === false) {
                    this.props.history.push("/login");
                } else {
                    this.setState({
                        projectAdminId: [this.props.auth.user.id],
                        projectMemberId: [this.props.auth.user.id]
                    });
                }
            });
    }

    onChangeProjectName(name) {
        this.setState({
            projectName: name.target.value
        });
    }

    onChangeProjectDescription(desc) {
        this.setState({
            projectDescription: desc.target.value
        });
    }

    validateForm(){
        let isValid = true;
        let error = {};

        if(Validator.isEmpty(this.state.projectName)){
            error.projectName =  "Project name field is required";

            isValid = false;
        }

        if(Validator.isEmpty(this.state.projectDescription)){
            error.projectDescription =  "Description field is required";

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

            const newProject = {
                projectName: this.state.projectName,
                projectDescription: this.state.projectDescription,
                projectAdminId: this.state.projectAdminId,
                projectMemberId: this.state.projectMemberId
            };

            const { match: { params } } = this.props;
            let route = "http://localhost:4000/loadnetic/addProject/";
            route = route.concat(params.teamId.toString());
            axios.post(route, newProject)
                .then(res => {
                    let teams = "/teamProfile/";
                    this.props.history.push(teams.concat(params.teamId.toString()));
                }).catch(err => {
                    const error = {};
                    error.team = err;
                    this.setState({
                        errors: error
                    });
            });

            this.setState({
                projectName: '',
                projectDescription: ''
            })
        }
    }

    render() {
        const { match: { params } } = this.props;
        let cancel = "/teamProfile/";
        cancel = cancel.concat(params.teamId);

        return (
            <div>
                <div class="container">
                    <h3>Create a New Project</h3>
                    <form onSubmit={this.onSubmit} name={"form"}>
                        <div className="form-group">
                            <label>Project Name: </label>
                            <input  name = "name"
                                    type="text"
                                    value={this.state.projectName}
                                    error={this.state.errors.projectName}
                                    onChange={this.onChangeProjectName}
                                    className={classnames("", {
                                        invalid: this.state.errors.projectName
                                    })}
                            />
                            <span className="red-text">
                                {this.state.errors.projectName}
                            </span>
                        </div>
                        <div className="form-group">
                            <label>Description: </label>
                            <input
                                name = "desc"
                                type="text"
                                value={this.state.projectDescription}
                                error={this.state.errors.projectDescription}
                                onChange={this.onChangeProjectDescription}
                                className={classnames("", {
                                    invalid: this.state.errors.projectDescription
                                })}
                            />
                            <span className="red-text">
                                {this.state.errors.projectDescription}
                            </span>
                        </div>
                        <div className="form-group">
                            <input type="submit" value="Create Project" className="btn btn-primary" />
                        </div>
                    </form>
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

CreateProject.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
)(CreateProject);