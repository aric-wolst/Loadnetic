import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

let teams = "/teams/";

const PrivateTeamsLink = ({ component: component, auth, ...rest}) => (
    <Link className="col" id="nameCol" to={auth.isAuthenticated === true ? (teams.concat(auth.user.id.toString())):("/")}>
        {auth.isAuthenticated === true ? ("Teams"):("")}
    </Link>
);

PrivateTeamsLink.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(PrivateTeamsLink);