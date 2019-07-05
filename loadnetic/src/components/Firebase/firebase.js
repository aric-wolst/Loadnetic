import app from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCcWLD3Y9oSUEUgDsfIIe2XJoTEGhQrt5w",
    authDomain: "loadnetic-wwt.firebaseapp.com",
    databaseURL: "https://loadnetic-wwt.firebaseio.com",
    projectId: "loadnetic-wwt",
    storageBucket: "",
    messagingSenderId: "1027265644499",
    appId: "1:1027265644499:web:81d4d743bfa6e371"
};

class Firebase {
    constructor() {
        app.initializeApp(firebaseConfig);

        this.auth = app.auth();
    }

    // *** Auth API ***

    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>
        this.auth.currentUser.updatePassword(password);
}

export default Firebase;