import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {Link} from "react-router-dom";
import axios from 'axios';
import {setCurrentTeam} from "../actions/teamActions";
import {setCurrentProject} from "../actions/projectActions";

let teamProfile = "/teamProfile/";

const Team = props => (
    <div className="col-4">
        <h4> <a href={teamProfile.concat(props.team._id)}>{props.team.teamName}</a></h4>
        <p>{props.team.teamDescription}</p>
        <p>Team Size: {props.team.teamSize}</p>
    </div>
);

class Teams extends Component {

    constructor(props) {
        super(props);

        this.state = {
            teams: [],
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
        }

        let route = "http://localhost:4000/users/getTeams/";
        route = route.concat(this.props.auth.user.id.toString());
        axios.get(route)
            .then(teams => {
                this.setState({
                    teams: teams.data
                });
            }).catch(err => {
                const error = {};
                error.teams = err;
                this.setState({
                    errors: error
                });
            }
        );

    }

    teamsList() {
        return this.state.teams.map(function(currentTeam, i){
            return <Team team={currentTeam} key={i} />;
        })
    }

    render() {
        const { user } = this.props.auth;

        let createTeam = "/createTeam/";
        createTeam = createTeam.concat(user.id.toString());

        return (
            <div>
                <div className="container">
                    <h3>{user.name}'s Teams</h3>
                    <div className="row">
                        { this.teamsList() }
                    </div>
                    <Link to={createTeam}>
                        <h4> New Team </h4>
                    </Link>
                </div>
            </div>
        )
    }
}

Teams.propTypes = {
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
)(Teams);