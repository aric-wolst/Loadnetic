import React, { Component } from 'react';
import {Link} from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import {connect} from "react-redux";

class TeamProfile extends Component {

    componentDidMount() {
        const { match: { params } } = this.props;
        let route = "http://localhost:4000/users/hasTeam/";
        route = route.concat(this.props.auth.user.id.toString(), "/", params.teamId);
        axios.get(route)
            .then(hasTeam => {
                if (hasTeam.data === false) {
                    this.props.history.push("/login");
                }
            });
    }

    render() {

        const { match: { params } } = this.props;
        let newProject = "/createProject/";
        newProject = newProject.concat(params.teamId.toString());

        return (
            <div>
                <div class="container">
                    <h3>Team Profile</h3>
                    <div>
                        <Link to={newProject}>
                            New Project
                        </Link>
                    </div>
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