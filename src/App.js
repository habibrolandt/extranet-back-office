import "./App.css";
import React from "react";
import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from "react-router-dom";
import LoadExternalScripts from "./Mescomposants/LoadExternalScripts";
import Dashboard from "./MesPages/dashboard";
import DetailsDemande, {
    detailsDemandeLoader,
} from "./MesPages/DetailsDemande";
import Demandes from "./MesPages/RegistrationRequests";
import SignIn from "./MesPages/SignIn";
import ListUser from "./MesPages/Users";
import Orders from "./MesPages/Orders";
import ProductStat from "./MesPages/ProductStat";
import Products from "./MesPages/Products";
import Product from "./MesPages/Product";
import Planning from "./MesPages/Planning";
import Zone from "./MesPages/Zone";
import CreateLivCalendar, {
    createLivCalLoader,
} from "./MesPages/CreateLivCalendar";
import EditLivCalendar from "./MesPages/EditLivCalendar";
import ConsultationDelivery, {
    consultationLivCalLoader,
} from "./MesPages/ConsultationDelivery";
import ListeUserApproved from "./MesPages/ListeUserApproved";
import Statistics from "./MesPages/Statistics";
import Visuel, { bannerListLoader } from "./MesPages/ContenuVisuel/Visuel";
import Order from "./MesPages/Order";
import Profils from "./MesPages/Profils";
import CreateOrEditProfil from "./MesPages/CreateOrEditProfil";
import CreateOrEditUser from "./MesPages/CreateUser";
import ProtectedRoute from "./Mescomposants/ProtectedRoute/ProtectedRoute";
import ProductsOutlet from "./Mescomposants/ProductsOutlet/ProductsOutlet";
import CustomersRequestOutlet from "./Mescomposants/CustomersRequestOutlet/CustomersRequestOutlet";
import Profil from "./MesPages/Profil";
import GraphiqueProduits from "./MesPages/Test";

const router = createBrowserRouter(
    [
        {
            path: "/connexion",
            element: <SignIn />,
            // loader: accueilLoader,  // Ajout d'un loader
        },
        {
            path: "/",
            element: <Dashboard />,
            children: [
                {
                    index: true,
                    element: <Navigate to={"/tableau-de-bord"} />,
                },
                {
                    path: "/tableau-de-bord",
                    element: (
                        <ProtectedRoute>
                            <Statistics />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "/d",
                    element: (
                        <ProtectedRoute>
                            <ProductStat />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "/demandes-clients",
                    element: (
                        <ProtectedRoute>
                            <CustomersRequestOutlet />
                        </ProtectedRoute>
                    ),
                    children: [
                        {
                            path: "/demandes-clients",
                            element: (
                                <ProtectedRoute>
                                    <Demandes />
                                </ProtectedRoute>
                            ),
                        },
                        {
                            path: "/demandes-clients/details/:clientID",
                            loader: detailsDemandeLoader,
                            element: (
                                <ProtectedRoute>
                                    <DetailsDemande />
                                </ProtectedRoute>
                            ),
                        },
                        {
                            path: "/demandes-clients/approuvées",
                            element: (
                                <ProtectedRoute>
                                    <ListeUserApproved />
                                </ProtectedRoute>
                            ),
                        },
                    ],
                },
                {
                    path: "/utilisateurs",
                    element: (
                        <ProtectedRoute>
                            <ListUser />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "/utilisateurs/creation",
                    element: (
                        <ProtectedRoute>
                            <CreateOrEditUser />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "/utilisateurs/modification/:ID",
                    element: (
                        <ProtectedRoute>
                            <CreateOrEditUser />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "/profils",
                    element: (
                        <ProtectedRoute>
                            <Profils />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "/profils/creation",
                    element: (
                        <ProtectedRoute>
                            <CreateOrEditProfil />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "/profils/modification/:ID",
                    element: (
                        <ProtectedRoute>
                            <CreateOrEditProfil />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "/commandes",
                    element: (
                        <ProtectedRoute>
                            <Orders />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "/commandes/:orderID",
                    element: (
                        <ProtectedRoute>
                            <Order />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "/produits",
                    element: (
                        <ProtectedRoute>
                            <ProductsOutlet />
                        </ProtectedRoute>
                    ),
                    children: [
                        {
                            path: "/produits/",
                            element: (
                                <ProtectedRoute>
                                    <Products />
                                </ProtectedRoute>
                            ),
                        },
                        {
                            path: "/produits/modification/:productID",
                            element: (
                                <ProtectedRoute>
                                    <Product />
                                </ProtectedRoute>
                            ),
                        },
                    ],
                },
                {
                    path: "/zones-livraisons",
                    element: (
                        <ProtectedRoute>
                            <Zone />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "/calendriers-livraisons",
                    element: (
                        <ProtectedRoute>
                            <Planning />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "/calendriers-livraisons/creation",
                    loader: createLivCalLoader,
                    element: (
                        <ProtectedRoute>
                            <CreateLivCalendar />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "/calendriers-livraisons/modification/:ID",
                    element: (
                        <ProtectedRoute>
                            <EditLivCalendar />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "/calendriers-livraisons/consultation/:ID",
                    loader: consultationLivCalLoader,
                    element: (
                        <ProtectedRoute>
                            <ConsultationDelivery />
                        </ProtectedRoute>
                    ),
                },

                {
                    path: "/bannieres",
                    loader: bannerListLoader,
                    element: (
                        <ProtectedRoute>
                            <Visuel />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "/profil",
                    element: (
                        <ProtectedRoute>
                            <Profil />
                        </ProtectedRoute>
                    ),
                },
            ],
        },
    ],
    {
        basename: "/extranetbackoffice",
    }
);

function App() {
    return (
        <div>
            {/* <RouteChangeTracker> */}
            <RouterProvider router={router} />
            <LoadExternalScripts />
            {/* </RouteChangeTracker> */}
        </div>
    );
}

export default App;
