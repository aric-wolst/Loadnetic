import React, { Component } from 'react';
import {Link} from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import {connect} from "react-redux";

class Project extends Component {

    componentDidMount() {

    }

    render() {
        return (
            <div>
                <div class="container">
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