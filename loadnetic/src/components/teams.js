import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {Link} from "react-router-dom";
import axios from 'axios';

let createTeam = "/teamProfile/";

const Team = props => (
    <div class="col-4">
        <h4> <a href={createTeam.concat(props.team._id)}>{props.team.teamName}</a></h4>
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

        console.log(this.props);
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
                <div class="container">
                    <h3>{user.name}'s Teams</h3>
                    <div class="row">
                        { this.teamsList() }
                    </div>
                    <Link to={createTeam}>
                        New Team
                    </Link>
                </div>
            </div>
        )
    }
}

Teams.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
)(Teams);