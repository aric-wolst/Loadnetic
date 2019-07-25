import React from 'react';

import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import { AuthUserContext } from '../Session';

const AccountPage = ({ authUser }) => (
    <div>
        <AuthUserContext.Consumer>
            {authUser =>
                authUser ? <AuthAccountPage /> : <NonAuthAccountPage />
            }
        </AuthUserContext.Consumer>
    </div>
);

const AuthAccountPage = () => (
    <div>
        <h1>Account Page</h1>
        <PasswordForgetForm />
        <PasswordChangeForm />
    </div>
);

const NonAuthAccountPage = () => (
    <h1>
        Sign in to access
    </h1>
);

export default AccountPage;