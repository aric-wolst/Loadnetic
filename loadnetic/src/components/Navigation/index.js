import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import { Link, withRouter} from 'react-router-dom';
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
            <Link to={ROUTES.ADMIN}>Admin</Link>
        </li>
        <li>
            <SignOutButton className="nav-button" />
        </li>
    </ul>
);

const NavigationNonAuth = () => (
    <ul>
        <li>
            <Link to={ROUTES.MAIN}>Loadnetic</Link>
        </li>
        <li>
            <Link to={ROUTES.SIGN_IN}>Log In</Link>
        </li>
    </ul>
);
export default withRouter(Navigation);