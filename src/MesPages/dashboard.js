import { Outlet } from "react-router-dom";
import CustomAppMenu from "../Mescomposants/CustomAppMenu";
import TopBar from "../Mescomposants/TopBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import usePrivilegesState from "../store/privilegesState";
import { useEffect } from "react";
import { Breadcrumb } from "react-bootstrap";
import Breadcrumbs from "../Mescomposants/Breadcrumbs/Breadcrumbs";

function Dashboard() {
    const user = JSON.parse(localStorage.getItem("user"));
    const privileges = usePrivilegesState((state) => state.privileges);

    return (
        <div id="layout-wrapper">
            <TopBar />
            <CustomAppMenu />
            <div className="vertical-overlay"></div>
            <ToastContainer />

            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-xl-12">
                                <Breadcrumbs />
                                <Outlet />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
