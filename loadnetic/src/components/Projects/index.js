import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import * as ROUTES from '../../constants/routes';

const ProjectsPage = () => (
    <div>
        <h1>Projects</h1>
    </div>
);

const condition = authUser => authUser;

export default withAuthorization(condition)(ProjectsPage);