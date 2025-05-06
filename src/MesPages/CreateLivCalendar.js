import React, { useEffect, useState } from "react";
import {
    Link,
    useLoaderData,
    useNavigate,
} from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { crudData, doRequest } from "../services/apiService";
import { format } from "date-fns";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { generatePageNumbers } from "../services/lib";

export async function createLivCalLoader() {
    let zone = null;

    const params = new FormData();
    params.append("mode", "getDeliveryPlace");
    params.append("LIMIT", 10);
    params.append("PAGE", 1);

    try {
        const response = await crudData(params, "CommandeManager.php");
        zone = response.data["data"];
    } catch (error) {
        console.error(error);
    }

    return { zone };
}

const schema = yup.object().shape({
    STR_LIVNAME: yup.string().required("Ce champ est requis"),
    DT_LIVBEGIN: yup
        .date("Vous devez entrer une date valide")
        .required("Ce champ est requis"),
    DT_LIVEND: yup
        .date("Vous devez entrer une date valide")
        .required("Ce champ est requis")
        .min(
            yup.ref("DT_LIVBEGIN"),
            "La date de fin doit être supérieure à la date de début"
        ),
    LG_LSTID: yup
        .string()
        .required("Ce champ est requis")
        .notOneOf([null, ""], "Vous devez choisir un lieu valide"),
});

function CreateLivCalendar() {
    const { zone } = useLoaderData();
    const navigate = useNavigate();
    const [show, setShow] = useState({
        showError: false,
        showSuccess: false,
    });
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [activeFilters, setActiveFilters] = useState();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(4);

    const handleSelectedCheckbox = (lg_commid) => {
        setSelectedCheckboxes((prevSelected) => {
            if (prevSelected.includes(lg_commid)) {
                return prevSelected.filter((i) => i !== lg_commid);
            } else {
                return [...prevSelected, lg_commid];
            }
        });
    };

    const handleSelectedAll = (orders) => {
        if (selectedCheckboxes.length === orders.length) {
            setSelectedCheckboxes([]);
        } else {
            setSelectedCheckboxes(orders.map((order) => order.lg_commid));
        }
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        const user = localStorage.getItem("user");

        if (!user) {
            navigate("/sign-in");
        }
    }, [navigate]);
    let currentUser = JSON.parse(localStorage.getItem("user"));

    const onSubmit = async (params) => {
        try {
            params["mode"] = "createDeliveryCalendar";
            params["STR_UTITOKEN"] = currentUser.STR_UTITOKEN;

            params["DT_LIVBEGIN"] = format(
                new Date(params["DT_LIVBEGIN"]),
                "yyyy-MM-dd'T'HH:mm:ss"
            );
            params["DT_LIVEND"] = format(
                new Date(params["DT_LIVEND"]),
                "yyyy-MM-dd'T'HH:mm:ss"
            );
            params["CMD_LIST"] = selectedCheckboxes;
            const response = await doRequest(params, "CommandeManager.php");
            if (response.data.code_statut === "1") {
                handleSetShowSuccess();
                reset();
                navigate("/dashboard/calendriers-livraisons");
            } else {
                console.error(response.data);
                handleSetShowError();
            }
        } catch (error) {
            console.error(error);
            handleSetShowError();
        }
    };

    const handleSetShowError = () => {
        setShow({
            ...show,
            showError: true,
        });
        setTimeout(() => {
            setShow({
                ...show,
                showError: false,
            });
        }, 2000);
    };

    const handleSetShowSuccess = () => {
        setShow({
            ...show,
            showSuccess: true,
        });
        setTimeout(() => {
            setShow({
                ...show,
                showSuccess: false,
            });
        }, 2000);
    };

    const goToPage = (page) => {
        setPage(page);
    };

    const handleSetLimit = (limit) => {
        setPage(1);
        setLimit(limit);
    };

    const handleSearch = (e) => {
        setPage(1);
        setActiveFilters({
            ...activeFilters,
            search: e,
        });
    };

    const fetchOrdersNotInLivraison = async (activeFilters) => {
        const data = new URLSearchParams();

        data.append("mode", "listeCommandeLocal");
        data.append("ORDER_NOT_ON_LIVRAISON", true);
        data.append("LIMIT", limit);
        data.append("PAGE", page);

        try {
            const response = await crudData(data, "CommandeManager.php");
            setTotalPage(() => {
                return Math.ceil(response.data["total"] / limit);
            });
            return response.data["data"];
        } catch (error) {
            console.error(error);
        }
    };

    const { data, isLoading } = useQuery({
        queryKey: ["orders", page, limit],
        queryFn: async () => {
            const result = await fetchOrdersNotInLivraison(activeFilters);
            console.log("Résultat de la requête :", result); // Vérifiez ici
            return result;
        },
        placeholderData: keepPreviousData,
    });

    const pageNumbers = generatePageNumbers(totalPage, page);

    return (
        <div className="row justify-content-center">
            <div className="col-xxl-12">
                <div className="card">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="card-body border-bottom border-bottom-dashed p-4">
                            <div className="row">
                                {show.showError && (
                                    <div
                                        className="alert alert-danger mb-xl-0"
                                        role="alert"
                                    >
                                        <strong>
                                            {" "}
                                            Erreur lors de la creation de
                                            l'utilisateur{" "}
                                        </strong>{" "}
                                        Contactez votre admistrateur
                                    </div>
                                )}

                                {show.showSuccess && (
                                    <div
                                        className="alert alert-success"
                                        role="alert"
                                    >
                                        <strong> Opération réussi !!</strong>
                                    </div>
                                )}
                            </div>
                            {/*end row*/}
                        </div>
                        <div className="card-body p-4">
                            <div className="row g-3">
                                <div className="col-12">
                                    <label
                                        htmlFor="STR_LIVNAME"
                                        className="form-label"
                                    >
                                        Description livraison{" "}
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="STR_LIVNAME"
                                        placeholder="Description"
                                        {...register("STR_LIVNAME")}
                                    />
                                    <p
                                        className="text-danger"
                                        style={{
                                            fontSize: "12px",
                                        }}
                                    >
                                        {errors.STR_LIVNAME?.message}
                                    </p>
                                </div>
                                <div className="col-12">
                                    <label
                                        htmlFor="LG_PROID"
                                        className="form-label"
                                    >
                                        Zone de livraison{" "}
                                    </label>
                                    <select
                                        className="form-select"
                                        {...register("LG_LSTID")}
                                    >
                                        <option value="">
                                            Open this select menu
                                        </option>
                                        {zone &&
                                            zone.map((item, index) => (
                                                <option
                                                    key={index}
                                                    value={item.id}
                                                >
                                                    {item.name ?? item.name}
                                                </option>
                                            ))}
                                    </select>
                                    <p
                                        className="text-danger"
                                        style={{
                                            fontSize: "12px",
                                        }}
                                    >
                                        {errors.LG_LSTID?.message}
                                    </p>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label
                                        htmlFor="DT_LIVBEGIN"
                                        className="form-label"
                                    >
                                        Date d'écheance
                                    </label>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        id="DT_LIVBEGIN"
                                        {...register("DT_LIVBEGIN")}
                                    />
                                    <p
                                        className="text-danger"
                                        style={{
                                            fontSize: "12px",
                                        }}
                                    >
                                        {errors.DT_LIVBEGIN?.message}
                                    </p>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label
                                        htmlFor="DT_LIVEND"
                                        className="form-label"
                                    >
                                        Date de livraison
                                    </label>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        id="DT_LIVEND"
                                        {...register("DT_LIVEND")}
                                    />
                                    <p
                                        className="text-danger"
                                        style={{
                                            fontSize: "12px",
                                        }}
                                    >
                                        {errors.DT_LIVEND?.message}
                                    </p>
                                </div>
                            </div>

                            <div
                                className="table-responsive table-card mb-1 p-3 d-flex flex-column"
                                style={{ minHeight: "388px" }}
                            >
                                <label>Commandes sur le calendrier</label>
                                <table
                                    className="table align-middle table-nowrap"
                                    id="customerTable"
                                >
                                    <thead className="table-light">
                                        <tr>
                                            <th
                                                scope="col"
                                                style={{ width: "50px" }}
                                            >
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="checkAll"
                                                        checked={
                                                            selectedCheckboxes.length ===
                                                            data?.length
                                                        }
                                                        onChange={() =>
                                                            handleSelectedAll(
                                                                data
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </th>
                                            <th className="text-uppercase th-text-color">
                                                Nom client
                                            </th>
                                            <th className="text-uppercase th-text-color">
                                                Numero commande
                                            </th>
                                            <th className="text-uppercase th-text-color">
                                                Date de commande
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="list form-check-all">
                                        {isLoading ? (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="text-center"
                                                >
                                                    Chargement des données...
                                                </td>
                                            </tr>
                                        ) : (
                                            data !== undefined &&
                                            data.map((item, index) => (
                                                <tr>
                                                    <th scope="row">
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="chk_child"
                                                                checked={selectedCheckboxes.includes(
                                                                    item.lg_commid
                                                                )}
                                                                onChange={() =>
                                                                    handleSelectedCheckbox(
                                                                        item.lg_commid
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </th>
                                                    <td className="customer_name">
                                                        {item.str_socname}
                                                    </td>
                                                    <td className="phone">
                                                        {item.lg_commid}
                                                    </td>
                                                    <td className="date">
                                                        {item.dt_commcreated}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                                {data !== undefined && (
                                    <div className="d-flex justify-content-between mt-auto">
                                        <>
                                            <div className="d-flex gap-4 align-items-center">
                                                <div>
                                                    Page {page} sur{" "}
                                                    {totalPage === 0
                                                        ? 1
                                                        : totalPage}
                                                </div>
                                                <label className="align-items-center mb-0">
                                                    Montrer{" "}
                                                    <select
                                                        name="alternative-pagination_length"
                                                        aria-controls="alternative-pagination"
                                                        className="form-select form-select-sm d-inline-block"
                                                        style={{ width: 75 }}
                                                        onChange={(e) => {
                                                            handleSetLimit(
                                                                e.target.value
                                                            );
                                                        }}
                                                        disabled={
                                                            totalPage === 0
                                                        }
                                                    >
                                                        <option
                                                            value="10"
                                                            selected={
                                                                limit === 10
                                                            }
                                                        >
                                                            10
                                                        </option>
                                                        <option
                                                            value="25"
                                                            selected={
                                                                limit === 25
                                                            }
                                                        >
                                                            25
                                                        </option>
                                                        <option
                                                            value="50"
                                                            selected={
                                                                limit === 50
                                                            }
                                                        >
                                                            50
                                                        </option>
                                                        <option
                                                            value="100"
                                                            selected={
                                                                limit === 100
                                                            }
                                                        >
                                                            100
                                                        </option>
                                                    </select>{" "}
                                                    entrées
                                                </label>
                                            </div>
                                            <div className="pagination-wrap hstack gap-2">
                                                <button
                                                    onClick={() => {
                                                        goToPage(
                                                            Math.max(
                                                                page - 1,
                                                                1
                                                            )
                                                        );
                                                    }}
                                                    type="button"
                                                    className={`page-item pagination-prev ${
                                                        page === 1
                                                            ? "disabled"
                                                            : ""
                                                    }`}
                                                >
                                                    Précedent
                                                </button>
                                                <ul className="pagination listjs-pagination mb-0">
                                                    {pageNumbers.map(
                                                        (pageNumber, index) =>
                                                            pageNumber ===
                                                            "..." ? (
                                                                <span
                                                                    key={index}
                                                                    className="dots"
                                                                >
                                                                    ...
                                                                </span>
                                                            ) : (
                                                                <li
                                                                    className={`${
                                                                        pageNumber ===
                                                                        page
                                                                            ? "active"
                                                                            : ""
                                                                    }`}
                                                                    key={index}
                                                                >
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            goToPage(
                                                                                pageNumber
                                                                            )
                                                                        }
                                                                        className={`page
                                                                    }`}
                                                                        tabIndex="0"
                                                                        data-i={`${index}`}
                                                                        data-page={`${totalPage}`}
                                                                    >
                                                                        {
                                                                            pageNumber
                                                                        }
                                                                    </button>
                                                                </li>
                                                            )
                                                    )}
                                                </ul>
                                                <button
                                                    onClick={() => {
                                                        goToPage(
                                                            Math.min(
                                                                page + 1,
                                                                totalPage
                                                            )
                                                        );
                                                    }}
                                                    type="button"
                                                    className={`page-item pagination-next ${
                                                        page + 1 > totalPage
                                                            ? "disabled"
                                                            : ""
                                                    }`}
                                                >
                                                    Suivant
                                                </button>
                                            </div>
                                        </>
                                    </div>
                                )}
                            </div>

                            {/*end row*/}
                            <div className="hstack gap-2 justify-content-end d-print-none mt-4">
                                <Link
                                    type="reset"
                                    to="/dashboard/calendriers-livraisons"
                                    className="btn btn-primary"
                                >
                                    Annuler
                                </Link>
                                <button
                                    type="submit"
                                    className="btn btn-success"
                                >
                                    <i className="ri-send-plane-fill align-bottom me-1" />{" "}
                                    Enregistrer
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            {/*end col*/}
        </div>
    );
}

export default CreateLivCalendar;
