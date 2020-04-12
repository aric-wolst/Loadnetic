import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from "prop-types";
import {connect} from "react-redux";

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
            teamMemberId: ['']
        }
    }

     componentDidMount() {
         const { match: { params } } = this.props;
         const { user } = this.props.auth;

         if (user.id !== params.id) {
             this.props.history.push("/login");
         } else {
             this.setState({
                 teamAdminId: [user.id],
                 teamMemberId: [user.id]
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
        let name = document.forms["form"]["name"].value;

        if(name === ""){
            alert("Name must be filled in");
            return false;
        } else {
            return true;
        }
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

            axios.post('http://localhost:4000/loadnetic/add', newTeam)
                .then(res => console.log(res.data));

            this.setState({
                teamName: '',
                teamDescription: '',
                teamSize: '1'
            })
        }
    }

    render() {
        return (
            <div>
                <h3>Create a New Team</h3>
                <form onSubmit={this.onSubmit} name={"form"}>
                    <div className="form-group">
                        <label>Team Name: </label>
                        <input  name = "name"
                                type="text"
                                value={this.state.teamName}
                                onChange={this.onChangeTeamName}
                        />
                    </div>
                    <div className="form-group">
                        <label>Description: </label>
                        <input
                            name = "desc"
                            type="text"
                            value={this.state.teamDescription}
                            onChange={this.onChangeTeamDescription}
                        />
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
            </div>
        )
    }
}

CreateTeam.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
)(CreateTeam);