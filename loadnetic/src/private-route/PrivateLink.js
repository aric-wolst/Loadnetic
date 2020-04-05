import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

let profile = "/profile/";

const PrivateLink = ({ component: component, auth, ...rest}) => (
    <Link className="col" id="nameCol" to={auth.isAuthenticated === true ? (profile.concat(auth.user.id.toString())):("/login")}>
        {auth.isAuthenticated === true ? (auth.user.name):("Login")}
    </Link>
);

PrivateLink.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(PrivateLink);