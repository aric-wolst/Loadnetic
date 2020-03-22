import React, { Component } from 'react';
import axios from 'axios';

export default class Landing extends Component {
    constructor(props) {
        super(props);

        this.userLogin = this.userLogin.bind(this);

        this.state = {
            user: ''
        }
    }

    userLogin () {

    }

    render() {
        return (
            <div>
                <p>Welcome to Loadnetic</p>
            </div>
        )
    }
}