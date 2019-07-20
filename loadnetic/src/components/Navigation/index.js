import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import { Link } from 'react-router-dom';
import { AuthUserContext } from '../Session';

const Navigation = ({ authUser }) => (
    <div>
        <AuthUserContext.Consumer>
            {authUser =>
                authUser ? <NavigationAuth /> : <NavigationNonAuth />
            }
        </AuthUserContext.Consumer>
    </div>
);

const NavigationAuth = () => (
    <ul>
        <li>
            <Link to={ROUTES.MAIN}>Loadnetic</Link>
        </li>
        <li>
            <Link to={ROUTES.PROJECTS}>Projects</Link>
        </li>
        <li>
            <Link to={ROUTES.ACCOUNT}>Account</Link>
        </li>
        <li>
            <SignOutButton />
        </li>
    </ul>
);

const NavigationNonAuth = () => (
    <ul>
        <li>
            <Link to={ROUTES.MAIN}>Loadnetic</Link>
        </li>
        <li>
            <Link to={ROUTES.SIGN_IN}>Sign In</Link>
        </li>
    </ul>
);
export default Navigation;