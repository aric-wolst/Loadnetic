import React, {Component} from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import "../componets-css/teamProfile.css";

class TeamMembers extends Component {

    constructor(props) {
        super(props);

        this.promoteUser = this.promoteUser.bind(this, this.props.team.email, this.props.teamId);
        this.demoteUser = this.demoteUser.bind(this, this.props.team.email, this.props.teamId);
        this.removeUser = this.removeUser.bind(this, this.props.team.email, this.props.teamId);
    }

    promoteUser = (userEmail, teamId) => {
        let userId = this.props.auth.user.id;
        return function() {

            const data = {
                email: userEmail
            };

            let request = "http://localhost:4000/loadnetic/promote/";
            request = request.concat(teamId, '/', userId);

            axios.post(request, data)
                .then(function () {
                    window.location.reload();
                })
                .catch(err => {

                });
        }
    };

    demoteUser = (userEmail, teamId) => {
        let userId = this.props.auth.user.id;
        return function() {
            const data = {
                email: userEmail
            };

            let request = "http://localhost:4000/loadnetic/demote/";
            request = request.concat(teamId, '/', userId);

            axios.post(request, data)
                .then(function () {
                    window.location.reload();
                })
                .catch(err => {

                });
        }
    };

    removeUser = (userEmail, teamId) => {
        let userId = this.props.auth.user.id;
        return function() {

            const data = {
                email: userEmail
            };

            let request = "http://localhost:4000/loadnetic/removeMember/";
            request = request.concat(teamId, '/', userId);

            axios.post(request, data)
                .then(function () {
                    window.location.reload();
                })
                .catch(err => {

                });
        }
    };

    render () {

        return (

            <div className={"row"}>
                <div className="col-3">{this.props.team.name}</div>
                {this.props.team.admin === true ? <div className="col-1"> Admin </div> : <div className="col-1"/>}
                <div className="col-4">{this.props.team.email}</div>
                {(this.props.user === true) ?
                    (this.props.team.admin === true ?
                        <div className="col-2">
                            <div className={"float-right"}>
                                <button className="btn btn-primary" onClick={this.demoteUser(this.props.team.email, this.props.teamId)}>Demote</button>
                            </div>
                        </div> :
                        <div className="col-2">
                            <div className={"float-right"}>
                                <button className="btn btn-primary" onClick={this.promoteUser(this.props.team.email, this.props.teamId)}>Promote</button>
                            </div>
                        </div>)
                    : (<div className="col-2"><div className={"float-right"}></div></div>)
                }
                {(this.props.user === true) ?
                    <div className="col-2">
                        <div className={"float-right"}>
                            <button className="btn btn-primary" onClick={this.removeUser(this.props.team.email, this.props.teamId)}>Remove</button>
                        </div>
                    </div>
                    : <div className="col-2"><div className={"float-right"}></div></div>
                }
            </div>
        )};
}

TeamMembers.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
)(withRouter(TeamMembers));