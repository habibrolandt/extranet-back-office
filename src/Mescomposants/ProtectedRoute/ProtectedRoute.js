import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        return <Navigate to={"/connexion"} replace />;
    }

    return children;
}

export default ProtectedRoute;
