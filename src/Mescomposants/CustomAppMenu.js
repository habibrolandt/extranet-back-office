import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import usePrivilegesState from "../store/privilegesState";
import UserIcon from "./UserIcon/UserIcon";
import CartIcon from "./CartIcon/CartIcon";
import ShopItemIcon from "./ShopItemIcon/ShopItemIcon";
import CalendarIcon from "./CalendarIcon/CalendarIcon";
import HomeIcon from "./HomeIcon/HomeIcon";
import ChartIcon from "./ChartIcon/ChartIcon";
import SettingIcon from "./SettingIcon/SettingIcon";
import CustomerIcon from "./CustomerIcon/CustomerIcon";

function CustomAppMenu() {
    const privileges = usePrivilegesState((state) => state.privileges);
    const [menu, setMenu] = useState([]);
    useEffect(() => {
        if (privileges !== null) {
            const initialMenu = [
                {
                    title: "Statistiques",
                    icon: <ChartIcon />,
                    children: [
                        {
                            title: "Statistiques",
                            href: "/statistiques",
                            privilege: "viewStatistics",
                        },
                    ],
                },
                {
                    title: "Clients",
                    icon: <CustomerIcon />,
                    children: [
                        {
                            title: "Demandes clients",
                            href: "/demandes-clients",
                            privilege: "viewCustomerRequests",
                        },
                        {
                            title: "Liste des clients",
                            href: "/demandes-clients/approuvées",
                            privilege: "viewCustomerList",
                        },
                    ],
                },
                {
                    title: "Utilisateurs",
                    icon: <UserIcon />,
                    children: [
                        {
                            title: "Utilisateurs",
                            href: "/utilisateurs",
                            privilege: "accessUsers",
                        },
                        {
                            title: "Profils",
                            href: "/profils",
                            privilege: "viewProfiles",
                        },
                    ],
                },
                {
                    title: "Commandes",
                    icon: <CartIcon />,
                    children: [
                        {
                            title: "Liste des commandes",
                            href: "/commandes",
                            privilege: "viewOrders",
                        },
                    ],
                },
                {
                    title: "Produits",
                    icon: <ShopItemIcon />,
                    children: [
                        {
                            title: "Mise à jour des produits",
                            href: "/produits",
                            privilege: "updateProducts",
                        },
                    ],
                },
                {
                    title: "Planning",
                    icon: <CalendarIcon />,
                    children: [
                        {
                            title: "Zones de livraisons",
                            href: "/zones-livraisons",
                            privilege: "viewDeliveryAreas",
                        },
                        {
                            title: "Calendriers de livraisons",
                            href: "/calendriers-livraisons",
                            privilege: "viewDeliveryCalendar",
                        },
                    ],
                },
                {
                    title: "Parametrage",
                    icon: <SettingIcon />,
                    children: [
                        {
                            title: "Bannières",
                            href: "/bannieres",
                            privilege: "viewBanners",
                        },
                        {
                            title: "Notifications",
                            href: "/notifications",
                            privilege: "viewNotifications",
                        },
                    ],
                },
            ];

            const filteredMenu = initialMenu
                .map((menuItem) => {
                    const filteredChildren = menuItem?.children.filter(
                        (child) => privileges[child.privilege]
                    );
                    return { ...menuItem, children: filteredChildren };
                })
                .filter((menuItem) => menuItem?.children.length > 0);

            setMenu(filteredMenu);
        }
    }, [privileges]);

    useEffect(() => {
        const element = document.querySelector(
            ".menu-dropdown .nav-sm .nav-item .nav-link.active"
        );

        if (element) {
            const menuDropdown = element.closest(".menu-dropdown");
            if (menuDropdown) {
                menuDropdown.setAttribute(
                    "class",
                    "menu-dropdown collapse show"
                );
                const neighbor = menuDropdown.previousElementSibling;
                neighbor.setAttribute("class", "nav-link menu-link active");
                neighbor.setAttribute("aria-expanded", "true");
            }
        }
    }, [menu]);

    return (
        <div
            className="app-menu navbar-menu"
            style={{ backgroundColor: "#214293" }}
        >
            {/* LOGO */}
            <div className="navbar-brand-box text-center">
                {/* Dark Logo*/}
                <a href="index.html" className="logo logo-dark">
                    <span className="logo-sm">
                        <img
                            src="assets/images/logo-blanc.png"
                            alt=""
                            height={22}
                        />
                    </span>
                    <span className="logo-lg">
                        <img
                            src="assets/images/logo-blanc.png"
                            alt=""
                            height={17}
                        />
                    </span>
                </a>
                {/* Light Logo*/}
                <a href="index.html" className="logo logo-light">
                    <span className="logo-sm">
                        <img
                            src="assets/images/logo-blanc.png"
                            alt=""
                            height={22}
                        />
                    </span>
                    <span className="logo-lg">
                        <img
                            src="assets/images/logo-blanc.png"
                            alt=""
                            height={60}
                        />
                    </span>
                </a>
                <button
                    type="button"
                    className="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover"
                    id="vertical-hover"
                >
                    <i className="ri-record-circle-line" />
                </button>
            </div>
            <div id="scrollbar">
                <div className="container-fluid">
                    <div id="two-column-menu"></div>
                    <ul className="navbar-nav" id="navbar-nav">
                        <li className="menu-title">
                            <span data-key="t-menu">Menu</span>
                        </li>
                        <NavLink
                            to="/tableau-de-bord"
                            className="nav-link"
                            data-key={`t-main-Dashboard`}
                        >
                            <HomeIcon />
                            <span>Tableau de bord</span>
                        </NavLink>
                        {menu &&
                            menu.map((item, index) => (
                                <li key={index} className="nav-item">
                                    <a
                                        className="nav-link menu-link"
                                        href={`#sidebar${item.title}`}
                                        // id={`sidebar${item.title}Title`}
                                        data-bs-toggle="collapse"
                                        role="button"
                                        aria-controls={`sidebar${item.title}`}
                                    >
                                        {item?.icon}
                                        <span data-key={`t-${item.title}`}>
                                            {item.title}
                                        </span>
                                    </a>
                                    <div
                                        className={`menu-dropdown collapse  `}
                                        id={`sidebar${item.title}`}
                                    >
                                        <ul className="nav nav-sm flex-column">
                                            {item?.children.map(
                                                (child, index) =>
                                                    !child.subMenu ? (
                                                        <li
                                                            className="nav-item"
                                                            key={index}
                                                        >
                                                            <NavLink
                                                                to={child.href}
                                                                className="nav-link"
                                                            >
                                                                {child.title}
                                                            </NavLink>
                                                        </li>
                                                    ) : (
                                                        <li
                                                            className="nav-item"
                                                            key={index}
                                                        >
                                                            <a
                                                                href={`#sidebar${child.title}`}
                                                                className="nav-link"
                                                                data-bs-toggle="collapse"
                                                                role="button"
                                                                aria-expanded="true"
                                                                aria-controls={`sidebar${child.title}`}
                                                                data-key={`t-${child.title}`}
                                                            >
                                                                {child.title}
                                                            </a>
                                                            <div
                                                                className="menu-dropdown collapse show"
                                                                id={`sidebar${child.title}`}
                                                            >
                                                                <ul className="nav nav-sm flex-column">
                                                                    <li className="nav-item">
                                                                        {child.children.map(
                                                                            (
                                                                                subChild,
                                                                                index
                                                                            ) => (
                                                                                <NavLink
                                                                                    to={
                                                                                        subChild.href
                                                                                    }
                                                                                    className="nav-link"
                                                                                    data-key={`t-main-${child.title}`}
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                >
                                                                                    {" "}
                                                                                    {
                                                                                        subChild.title
                                                                                    }{" "}
                                                                                </NavLink>
                                                                            )
                                                                        )}
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </li>
                                                    )
                                            )}
                                        </ul>
                                    </div>
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
            <div className="sidebar-background" />
        </div>
    );
}

function NavItem({ title, href }) {
    return (
        <li className="nav-item">
            <NavLink to={href} className="nav-link">
                {" "}
                {title}
            </NavLink>
        </li>
    );
}

export default CustomAppMenu;
