import React from 'react';

import { withFirebase } from '../Firebase';
import * as ROUTES from "../../constants/routes";

const SignOutButton = ({ firebase }) => <button type="button" onClick={
    this.props.firebase
        .doSignOut
        .props.history.push(ROUTES.HOME)}
>
    Sign Out
</button>;

export default withFirebase(SignOutButton)