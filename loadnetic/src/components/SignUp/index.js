import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import './index.css'

const SignUpPage = () => (
    <div>
        <Row className="justify-content-md-center">
            <Col md="auto">
                <h1 className="signup-header">Sign Up</h1>
            </Col>
        </Row>
        <Container className="signup-container">
            <Row className="justify-content-md-center">
                <Col md="auto">
                    <SignUpForm />
                </Col>
            </Row>
        </Container>
    </div>
);

const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null,
};

class SignUpFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = {...INITIAL_STATE}
    }

    onSubmit = event => {
        const { email, passwordOne } = this.state;

        this.props.firebase
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.PROJECTS);
            })
            .catch(error => {
                this.setState({ error });
            });

        event.preventDefault();
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const {
            email,
            passwordOne,
            passwordTwo,
            error,
        } = this.state;

        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === '' ||
            email === '';

        return (
            <form onSubmit={this.onSubmit}>
                <Row clasName="signup-row">
                    <Col className="signup-col">
                        <input
                        name="email"
                        value={email}
                        onChange={this.onChange}
                        type="text"
                        placeholder="Email Address"
                        id="signup-input"
                        />
                    </Col>
                </Row>
                <Row clasName="signup-row">
                    <Col className="signup-col">
                        <input
                        name="passwordOne"
                        value={passwordOne}
                        onChange={this.onChange}
                        type="password"
                        placeholder="Password"
                        id="signup-input"
                        />
                    </Col>
                    <Col className="signup-col">
                        <input
                        name="passwordTwo"
                        value={passwordTwo}
                        onChange={this.onChange}
                        type="password"
                        placeholder="Confirm Password"
                        id="signup-input"
                        />
                    </Col>
                </Row>
                <Row className="justify-content-md-center" id="signup-button-row">
                    <Col md="auto">
                        <button className="signup-button" disabled={isInvalid} type="submit">Sign Up</button>

                        {error && <p>{error.message}</p>}
                    </Col>
                </Row>
            </form>
        );
    }
}

const SignUpLink = () => (
    <p>
        Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </p>
);

const SignUpForm = compose(
    withRouter,
    withFirebase,
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };