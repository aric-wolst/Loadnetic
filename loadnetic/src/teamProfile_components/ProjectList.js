import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import "../componets-css/teamProfile.css";

class ProjectList extends Component {

    render() {
        let projectProfile = "/project/";

        return(
            <div className="col-4">
                <h4> <a href={projectProfile.concat(this.props.project._id)}>{this.props.project.projectName}</a></h4>
                <p>{this.props.project.projectDescription}</p>
            </div>
        );
    }
}

ProjectList.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
)(ProjectList);