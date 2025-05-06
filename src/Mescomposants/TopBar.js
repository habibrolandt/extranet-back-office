// src/components/Accueil.js
import { useTheme } from "../contexts/ThemeContext";
import { useUserData } from "../contexts/UserDataContext";
import { doDisConnexion, fullUrl } from "../services/apiService";
import { Link, useNavigate } from "react-router-dom";

const TopBar = () => {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const { user: currentUser } = useUserData();

    const profile = {
        "13121316382501833409": "Designer",
        "13121523295256267666": "Gérant",
        2: "Admin",
    };

    const handleChangeTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        toggleTheme(newTheme);
    };

    const handledDoDisconnexion = async () => {
        const params = {
            mode: "doDisConnexion",
            STR_UTITOKEN: currentUser && currentUser?.STR_UTITOKEN,
        };
        try {
            const response = await doDisConnexion(params);
            if ((response.data.code_statut = "1")) {
                localStorage.clear();
                navigate("/");
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <>
            <header id="page-topbar">
                <div className="layout-width">
                    <div className="navbar-header">
                        <div className="d-flex">
                            {/* LOGO */}
                            <div className="navbar-brand-box horizontal-logo">
                                <a href="index.html" className="logo logo-dark">
                                    <span className="logo-sm">
                                        <img
                                            src="assets/images/logo-sm.png"
                                            alt=""
                                            height={22}
                                        />
                                    </span>
                                    <span className="logo-lg">
                                        <img
                                            src="assets/images/logo-dark.png"
                                            alt=""
                                            height={17}
                                        />
                                    </span>
                                </a>
                                <a
                                    href="index.html"
                                    className="logo logo-light"
                                >
                                    <span className="logo-sm">
                                        <img
                                            src="assets/images/logo-sm.png"
                                            alt=""
                                            height={22}
                                        />
                                    </span>
                                    <span className="logo-lg">
                                        <img
                                            src="assets/images/logo-blanc.svg"
                                            alt=""
                                            height={17}
                                        />
                                    </span>
                                </a>
                            </div>
                            <button
                                type="button"
                                className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger"
                                id="topnav-hamburger-icon"
                            >
                                <span className="hamburger-icon">
                                    <span />
                                    <span />
                                    <span />
                                </span>
                            </button>
                            {/* App Search*/}
                        </div>
                        <div className="d-flex align-items-center">
                            <div className="dropdown d-md-none topbar-head-dropdown header-item">
                                <button
                                    type="button"
                                    className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
                                    id="page-header-search-dropdown"
                                    data-bs-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                >
                                    <i className="bx bx-search fs-22" />
                                </button>
                                <div
                                    className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
                                    aria-labelledby="page-header-search-dropdown"
                                >
                                    <form className="p-3">
                                        <div className="form-group m-0">
                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Search ..."
                                                    aria-label="Recipient's username"
                                                />
                                                <button
                                                    className="btn btn-primary"
                                                    type="submit"
                                                >
                                                    <i className="mdi mdi-magnify" />
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="ms-1 header-item d-none d-sm-flex">
                                {/* <button onClick={handleChangeTheme}>
      Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
    </button> */}
                                <button
                                    onClick={handleChangeTheme}
                                    type="button"
                                    className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle light-dark-mode"
                                >
                                    <i className="bx bx-moon fs-22" />
                                </button>
                            </div>
                            <div
                                className="dropdown topbar-head-dropdown ms-1 header-item"
                                id="notificationDropdown"
                            >
                                <button
                                    type="button"
                                    className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
                                    id="page-header-notifications-dropdown"
                                    data-bs-toggle="dropdown"
                                    data-bs-auto-close="outside"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                >
                                    <i className="bx bx-bell fs-22" />
                                    <span className="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-danger">
                                        0
                                        <span className="visually-hidden">
                                            unread messages
                                        </span>
                                    </span>
                                </button>
                                <div
                                    className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
                                    aria-labelledby="page-header-notifications-dropdown"
                                >
                                    <div className="dropdown-head bg-primary bg-pattern rounded-top">
                                        <div className="p-3">
                                            <div className="row align-items-center">
                                                <div className="col">
                                                    <h6 className="m-0 fs-16 fw-semibold text-white">
                                                        {" "}
                                                        Notifications{" "}
                                                    </h6>
                                                </div>
                                                <div className="col-auto dropdown-tabs">
                                                    <span className="badge bg-light-subtle text-body fs-13">
                                                        {" "}
                                                        0 new
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-2 pt-2">
                                            <ul
                                                className="nav nav-tabs dropdown-tabs nav-tabs-custom"
                                                data-dropdown-tabs="true"
                                                id="notificationItemsTab"
                                                role="tablist"
                                            >
                                                <li className="nav-item waves-effect waves-light">
                                                    <a
                                                        className="nav-link active"
                                                        data-bs-toggle="tab"
                                                        href="#all-noti-tab"
                                                        role="tab"
                                                        aria-selected="true"
                                                    >
                                                        All (0)
                                                    </a>
                                                </li>
                                                <li className="nav-item waves-effect waves-light">
                                                    <a
                                                        className="nav-link"
                                                        data-bs-toggle="tab"
                                                        href="#messages-tab"
                                                        role="tab"
                                                        aria-selected="false"
                                                    >
                                                        Messages
                                                    </a>
                                                </li>
                                                <li className="nav-item waves-effect waves-light">
                                                    <a
                                                        className="nav-link"
                                                        data-bs-toggle="tab"
                                                        href="#alerts-tab"
                                                        role="tab"
                                                        aria-selected="false"
                                                    >
                                                        Alerts
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div
                                        className="tab-content position-relative"
                                        id="notificationItemsTabContent"
                                    >
                                        <div
                                            className="tab-pane fade show active py-2 ps-2"
                                            id="all-noti-tab"
                                            role="tabpanel"
                                        >
                                            <div
                                                data-simplebar=""
                                                style={{
                                                    maxHeight: 300,
                                                    height: 300,
                                                }}
                                                className="pe-2"
                                            ></div>
                                        </div>
                                        <div
                                            className="tab-pane fade py-2 ps-2"
                                            id="messages-tab"
                                            role="tabpanel"
                                            aria-labelledby="messages-tab"
                                        >
                                            <div
                                                data-simplebar=""
                                                style={{
                                                    maxHeight: 300,
                                                    height: 300,
                                                }}
                                                className="pe-2"
                                            ></div>
                                        </div>
                                        <div
                                            className="tab-pane fade p-4"
                                            id="alerts-tab"
                                            role="tabpanel"
                                            aria-labelledby="alerts-tab"
                                        />
                                        <div
                                            className="notification-actions"
                                            id="notification-actions"
                                        >
                                            <div className="d-flex text-muted justify-content-center">
                                                Select{" "}
                                                <div
                                                    id="select-content"
                                                    className="text-body fw-semibold px-1"
                                                >
                                                    0
                                                </div>{" "}
                                                Result{" "}
                                                <button
                                                    type="button"
                                                    className="btn btn-link link-danger p-0 ms-3"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#removeNotificationModal"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="dropdown ms-sm-3 header-item topbar-user">
                                <button
                                    type="button"
                                    className="btn"
                                    id="page-header-user-dropdown"
                                    data-bs-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                >
                                    <span className="d-flex align-items-center">
                                        {currentUser &&
                                        currentUser.STR_UTIPIC ? (
                                            <img
                                                className="rounded-circle header-profile-user"
                                                src={
                                                    fullUrl +
                                                    currentUser?.STR_UTIPIC
                                                }
                                                alt="Header Avatar"
                                            />
                                        ) : (
                                            <img
                                                className="rounded-circle header-profile-user"
                                                src="default.jpeg"
                                                alt="Header Avatar"
                                            />
                                        )}
                                        <span className="text-start ms-xl-2">
                                            <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                                                {currentUser &&
                                                    currentUser?.STR_UTIFIRSTLASTNAME}
                                            </span>
                                            <span className="d-none d-xl-block ms-1 fs-12 user-name-sub-text">
                                                {currentUser &&
                                                    currentUser?.STR_PRODESCRIPTION}
                                            </span>
                                        </span>
                                    </span>
                                </button>
                                <div className="dropdown-menu dropdown-menu-end">
                                    {/* item*/}
                                    <h6 className="dropdown-header">
                                        Bienvenu{" "}
                                        {currentUser &&
                                            currentUser?.STR_UTILOGIN?.toUpperCase()}
                                    </h6>
                                    <Link
                                        className="dropdown-item"
                                        to={"/profil"}
                                    >
                                        <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1" />{" "}
                                        <span className="align-middle">
                                            Profile
                                        </span>
                                    </Link>
                                    <button
                                        onClick={handledDoDisconnexion}
                                        className="dropdown-item"
                                        href="auth-logout-basic.html"
                                    >
                                        <i className="mdi mdi-logout text-muted fs-16 align-middle me-1" />{" "}
                                        <span
                                            className="align-middle"
                                            data-key="t-logout"
                                        >
                                            Deconnexion
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div
                id="removeNotificationModal"
                className="modal fade zoomIn"
                tabIndex={-1}
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                id="NotificationModalbtn-close"
                            />
                        </div>
                        <div className="modal-body">
                            <div className="mt-2 text-center">
                                <lord-icon
                                    src="../../../../cdn.lordicon.com/gsqxdxog.json"
                                    trigger="loop"
                                    colors="primary:#f7b84b,secondary:#f06548"
                                    style={{ width: 100, height: 100 }}
                                />
                                <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
                                    <h4>Are you sure ?</h4>
                                    <p className="text-muted mx-4 mb-0">
                                        Are you sure you want to remove this
                                        Notification ?
                                    </p>
                                </div>
                            </div>
                            <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
                                <button
                                    type="button"
                                    className="btn w-sm btn-light"
                                    data-bs-dismiss="modal"
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="btn w-sm btn-danger"
                                    id="delete-notification"
                                >
                                    Yes, Delete It!
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* /.modal-content */}
                </div>
                {/* /.modal-dialog */}
            </div>
        </>
    );
};

export default TopBar;

// const ThemeSwitcher = () => {
//   const { theme, toggleTheme } = useTheme();

//   const handleChangeTheme = () => {
//     const newTheme = theme === 'light' ? 'dark' : 'light';
//     toggleTheme(newTheme);
//   };

//   return (
//     <button onClick={handleChangeTheme}>
//       Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
//     </button>
//   );
// };

// export default ThemeSwitcher;
