import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Home from "../routes/Home";
import Auth from "../routes/Auth";

const AppRouter = ({ isLoggedIn }) => {
    return (
        <HashRouter>
            {isLoggedIn ? (
                <>
                    <Route path="/" exact>
                        <Home />
                    </Route>
                </>
            ) : (
                <>
                    <Route path="/">
                        <Auth />
                    </Route>
                </>
            )}
        </HashRouter>
    );
};

export default AppRouter;
