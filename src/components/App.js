import React, { useEffect, useState } from "react";
import { authService } from "../fbase";
import AppRouter from "./router";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [init, setInit] = useState(false);
    useEffect(() => {
        authService.onAuthStateChanged((user) => {
            if (user) {
                setIsLoggedIn(true);
            }
            setInit(true);
        });
    }, []);

    return <>{init ? <AppRouter isLoggedIn={isLoggedIn} /> : "Loading...."}</>;
}

export default App;
