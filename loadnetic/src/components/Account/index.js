import React from 'react';

import { AuthUserContext, withAuthorization } from '../Session';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';

import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import './index.css';

const AccountPage = () => (
    <AuthUserContext.Consumer>
        {authUser => (
            <div>
                <Row className="justify-content-md-center">
                    <Col md = "auto">
                        <h1 className="account-header">
                            Account: {authUser.email}
                        </h1>
                    </Col>
                </Row>
                <Container className="account-container">
                    <PasswordChangeForm />
                </Container>
            </div>
        )}
    </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountPage);