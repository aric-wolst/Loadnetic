import React from 'react';
import { Link } from 'react-router-dom';
import {Navbar, Nav, Button, FormControl, Form} from 'react-bootstrap'
import './index.css';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';

const Navigation = () => (
        <Navbar bg="primary" variant="dark">
            <Navbar.Brand href="/">Navbar</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link href="/projects">Projects</Nav.Link>
                <Nav.Link href="/account">Account</Nav.Link>
                <Nav.Link href="/signin">Sign In</Nav.Link>
                <li>
                    <SignOutButton/>
                </li>
            </Nav>
        </Navbar>
);

export default Navigation;