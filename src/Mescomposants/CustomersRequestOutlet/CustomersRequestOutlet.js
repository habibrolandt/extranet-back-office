import React from "react";
import { Outlet } from "react-router-dom";

function CustomersRequestOutlet() {
    return (
        <>
            <Outlet />
        </>
    );
}

export default CustomersRequestOutlet;
