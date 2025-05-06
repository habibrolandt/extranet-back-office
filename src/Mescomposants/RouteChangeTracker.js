import React, { useEffect } from "react";
import { useNavigation } from "react-router-dom";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const RouteChangeTracker = () => {
    // const navigation = useNavigation();

    useEffect(() => {
        if (true) {
            NProgress.start(); // Démarre la barre de progression
        } else {
            NProgress.done(); // Termine la barre de progression
        }
    }, []);

    return null;
};

export default RouteChangeTracker;
