import React from "react";
import { Link, useLocation } from "react-router-dom";

function Breadcrumbs() {
    const location = useLocation();
    console.log(location.pathname);
    return (
        <ol className="breadcrumb m-0">
            <li
                className={`breadcrumb-item ${
                    location.pathname.includes("/produits") &&
                    location.pathname !== "/produits"
                        ? "d-flex"
                        : "d-none"
                }`}
            >
                <Link to={"/produits"}>Produits</Link>
            </li>
            <li
                className={`breadcrumb-item ${
                    location.pathname.includes("/produits/modification")
                        ? "d-flex active"
                        : "d-none"
                }`}
            >
                Modification produit
            </li>
            <li
                className={`breadcrumb-item ${
                    location.pathname.includes("/utilisateurs") &&
                    location.pathname !== "/utilisateurs"
                        ? "d-flex"
                        : "d-none"
                }`}
            >
                <Link to={"/utilisateurs"}>Utilisateurs</Link>
            </li>
            <li
                className={`breadcrumb-item ${
                    location.pathname.includes("/utilisateurs/creation")
                        ? "d-flex active"
                        : "d-none"
                }`}
            >
                Creation utilisateur
            </li>
            <li
                className={`breadcrumb-item ${
                    location.pathname.includes("/utilisateurs/modification")
                        ? "d-flex active"
                        : "d-none"
                }`}
            >
                Modification utilisateur
            </li>
            <li
                className={`breadcrumb-item ${
                    location.pathname.includes("/demandes-clients") &&
                    location.pathname !== "/demandes-clients"
                        ? "d-flex"
                        : "d-none"
                }`}
            >
                <Link to={"/demandes-clients"}>Demandes d'inscription</Link>
            </li>
            <li
                className={`breadcrumb-item ${
                    location.pathname.includes("/demandes-clients/")
                        ? "d-flex active"
                        : "d-none"
                }`}
            >
                Details demande
            </li>
            <li
                className={`breadcrumb-item ${
                    location.pathname.includes("/commandes") &&
                    location.pathname !== "/commandes"
                        ? "d-flex"
                        : "d-none"
                }`}
            >
                <Link to={"/commandes"}>Commandes</Link>
            </li>
            <li
                className={`breadcrumb-item ${
                    location.pathname.includes("/commandes/")
                        ? "d-flex active"
                        : "d-none"
                }`}
            >
                Details commande
            </li>
            <li
                className={`breadcrumb-item ${
                    location.pathname.includes("/calendriers-livraisons") &&
                    location.pathname !== "/calendriers-livraisons"
                        ? "d-flex"
                        : "d-none"
                }`}
            >
                <Link to={"/calendriers-livraisons"}>
                    Calendriers de Livraison
                </Link>
            </li>
            <li
                className={`breadcrumb-item ${
                    location.pathname.includes(
                        "/calendriers-livraisons/consultation"
                    )
                        ? "d-flex active"
                        : "d-none"
                }`}
            >
                Details calendrier
            </li>
            <li
                className={`breadcrumb-item ${
                    location.pathname.includes(
                        "/calendriers-livraisons/modification"
                    )
                        ? "d-flex active"
                        : "d-none"
                }`}
            >
                Modification calendrier
            </li>
        </ol>
    );
}

export default Breadcrumbs;
