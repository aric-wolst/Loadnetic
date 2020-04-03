import React, { Component } from 'react';
import { Link } from "react-router-dom";

export default class Register extends Component {

    constructor() {
        super();
        this.state = {
            name: "",
            email: "",
            password: "",
            password2: "",
            errors: {}
        };
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    onSubmit = e => {

        //Prevent page reload
        e.preventDefault();

        const newUser = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password2: this.state.password2
        };

        console.log(newUser);
    };

    render() {
        return (
            <div>
                <h3>Register</h3>
                <form noValidate onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <input
                            onChange={this.onChange}
                            value={this.state.name}
                            error={this.state.errors.name}
                            id="name"
                            type="text"
                        />
                        <label htmlFor="name">Name</label>
                    </div>
                    <div className="form-group">
                        <input
                            onChange={this.onChange}
                            value={this.state.email}
                            error={this.state.errors.email}
                            id="email"
                            type="email"
                        />
                        <label htmlFor="email">Email</label>
                    </div>
                    <div className="form-group">
                        <input
                            onChange={this.onChange}
                            value={this.state.password}
                            error={this.state.errors.password}
                            id="password"
                            type="password"
                        />
                        <label htmlFor="password">Password</label>
                    </div>
                    <div className="form-group">
                        <input
                            onChange={this.onChange}
                            value={this.state.password2}
                            error={this.state.errors.password2}
                            id="password2"
                            type="password"
                        />
                        <label htmlFor="password2">Confirm Password</label>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Register" className="btn btn-primary" />
                    </div>
                </form>
                <p>
                    Already have an account? <Link to="/login">Log in</Link>
                </p>
            </div>
        )
    }
}