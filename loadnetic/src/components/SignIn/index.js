import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './index.css';


const SignInPage = () => (
    <div>
        <Row className="justify-content-md-center">
            <Col md = "auto">
                <h1>SignIn</h1>
            </Col>
        </Row>
        <Row className="justify-content-md-center">
            <Col md = "auto">
                <SignInForm />
            </Col>
        </Row>
        <Row className="justify-content-md-center">
            <Col md = "auto">
                <PasswordForgetLink />
            </Col>
        </Row>
        <Row className="justify-content-md-center">
            <Col md = "auto">
                <SignUpLink />
            </Col>
        </Row>
    </div>
);

const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
};

class SignInFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        const { email, password } = this.state;

        this.props.firebase
            .doSignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.PROJECTS);
            })
            .catch(error => {
                this.setState({ error });
            });

        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { email, password, error } = this.state;

        const isInvalid = password === '' || email === '';

        return (
            <form onSubmit={this.onSubmit}>
                <Row className="justify-content-md-center">
                    <Col md = "auto">
                        <input
                            name="email"
                            value={email}
                            onChange={this.onChange}
                            type="text"
                            placeholder="Email Address"
                        />
                    </Col>
                    <Col md = "auto">
                        <input
                            name="password"
                            value={password}
                            onChange={this.onChange}
                            type="password"
                            placeholder="Password"
                        />
                    </Col>
                </Row>
                <Row className="justify-content-md-center">
                    <Col md = "auto">
                        <button className = "login-button" disabled={isInvalid} type="submit">
                        Log In
                        </button>
                    </Col>
                </Row>
                    {error && <p>{error.message}</p>}
            </form>
        );
    }
}

const SignInForm = compose(
    withRouter,
    withFirebase,
)(SignInFormBase);

export default SignInPage;

export { SignInForm };