import React, { Component } from 'react';
import PropTypes from "prop-types";
import {connect} from "react-redux";

class Project extends Component {

    componentDidMount() {

    }

    render() {
        return (
            <div>
                <div className="container">
                    <h3>Project Profile</h3>
                </div>
            </div>
        )
    }
}

Project.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
)(Project);