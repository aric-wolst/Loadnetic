import React from 'react';
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navigation from '../Navigation';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import AccountPage from '../Account';
import AdminPage from '../Admin';

import * as ROUTES from '../../constants/routes';
import ProjectsPage from "../Projects";
import MainPage from "../Main";
import withAuthentication from "../Session/withAuthentication";

const App = () => (
    <Router>
        <div>
            <Navigation />
            <Route exact path={ROUTES.MAIN} component={MainPage} />
            <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
            <Route path={ROUTES.SIGN_IN} component={SignInPage} />
            <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
            <Route path={ROUTES.PROJECTS} component={ProjectsPage} />
            <Route path={ROUTES.ACCOUNT} component={AccountPage} />
            <Route path={ROUTES.ADMIN} component={AdminPage} />
        </div>
    </Router>
);

export default withAuthentication(App);