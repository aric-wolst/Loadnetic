import React from 'react';

import { withFirebase } from '../Firebase';
import * as ROUTES from "../../constants/routes";

const SignOutButton = ({ firebase }) => (
    <button className="nav-button" type="button" onClick={
        function(){
            firebase.doSignOut();
            window.location.replace(ROUTES.SIGN_IN)
        }
    }>
        Log Out
    </button>
);

export default withFirebase(SignOutButton)