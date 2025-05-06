import React from "react";
import { Outlet } from "react-router-dom";

function ProductsOutlet() {
    return (
        <>
            <Outlet></Outlet>
        </>
    );
}

export default ProductsOutlet;
