import React from "react";
import { fbaseInstance, authService } from "../fbase";

const Auth = () => {
    const AuthWithGoogle = async () => {
        const googleAuthProvider = new fbaseInstance.auth.GoogleAuthProvider();
        try {
            await authService.signInWithPopup(googleAuthProvider);
        } catch (err) {
            throw err;
        }
    };
    return (
        <>
            <h1>Please Login First and enjoy our DoodleMoji (❁´◡`❁)</h1>
            <button onClick={AuthWithGoogle}>Log In With Google (❁´◡`❁)</button>
        </>
    );
};

export default Auth;
