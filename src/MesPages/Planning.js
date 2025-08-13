import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { crudData, doRequest } from "../services/apiService";
import TableWithPaginationHOC from "../Mescomposants/TableWithPaginationHOC/TableWithPaginationHOC";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { generatePageNumbers, formatDateOriginal } from "../services/lib";
import { pdf } from "@react-pdf/renderer";
import { toast } from "react-toastify";
import ListDeliveryCalendarPDF from "../Mescomposants/exportPDF/listDeliveryCalendarPDF";

function Planning() {
    const [totalPage, setTotalPage] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();
    const [isExporting, setIsExporting] = useState(false);
    const [activeFilters, setActiveFilters] = useState(() => {
        const filters = {};
        searchParams.forEach((value, key) => {
            filters[key] = value;
        });
        delete filters.limit;
        delete filters.page;
        return filters;
    });

    const [page, setPage] = useState(() => {
        return parseInt(searchParams.get("page")) || 1;
    });
    const [limit, setLimit] = useState(() => {
        return parseInt(searchParams.get("limit")) || 10;
    });
    const [currentData, setCurrentData] = useState([]);
    const navigate = useNavigate();
    const [selectedCheckBoxes, setSelectedCheckBoxes] = useState([]);

    const handleSelectedCheckboxes = (index) => {
        setSelectedCheckBoxes((prevSelectedCheckBoxes) => {
            if (prevSelectedCheckBoxes.includes(index)) {
                return prevSelectedCheckBoxes.filter((v) => v !== index);
            } else {
                return [...prevSelectedCheckBoxes, index];
            }
        });
    };

    const handleSelectAllCheckbox = () => {
        if (selectedCheckBoxes.length === currentData.length) {
            setSelectedCheckBoxes([]);
        } else {
            setSelectedCheckBoxes(currentData.map((_, index) => index));
        }
    };

    const handleDeleteCalendar = async () => {
        const list = [];
        currentData.forEach((item, index) => {
            if (selectedCheckBoxes.includes(index)) {
                list.push(item.lg_livid);
            }
        });

        const data = {
            mode: "deleteDeliveryCalendar",
            LIST_LG_LIVID: list,
        };

        try {
            const response = await doRequest(data, "CommandeManager.php");
            if (response.data.code_statut === "1") {
                const newCurrentData = currentData.filter(
                    (item, index) => !selectedCheckBoxes.includes(index)
                );
                setCurrentData(newCurrentData);
                setSelectedCheckBoxes([]);
                setTotalPage(() => {
                    return Math.ceil(response.data["total"] / limit);
                });
                goToPage(1);
                toast.success("Suppression effectuée avec succès");
            } else {
                toast.error("Erreur lors de la suppression");
            }
        } catch (error) {
            console.error(error.message);
            toast.error("Une erreur est survenue lors de la suppression");
        }
    };

    const handleCloseCalendar = async (lg_livid) => {
        const params = {
            mode: "closeDeliveryCalendar",
            LG_LIVID: lg_livid,
        };
        try {
            const response = await doRequest(params, "CommandeManager.php");
            if (response.data.code_statut === "1") {
                setCurrentData((prevData) => {
                    return prevData.map((item) => {
                        if (item.lg_livid === lg_livid) {
                            return { ...item, str_livstatut: "closed" };
                        }
                        return item;
                    });
                });
                toast.success("Calendrier fermé avec succès");
            }
        } catch (error) {
            console.log(error);
            toast.error("Erreur lors de la fermeture du calendrier");
        }
    };

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (!user) {
            navigate("/");
        }
    }, [navigate]);

    const goToPage = (page) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", page);
        setSearchParams(params);
        setPage(page);
    };

    const handleSetLimit = (limit) => {
        const params = new URLSearchParams(searchParams);
        params.set("limit", limit);
        params.set("page", 1);
        setSearchParams(params);
        setPage(1);
        setLimit(limit);
    };

    const handleSearch = (e) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", 1);
        params.set("search", e);
        setSearchParams(params);
        setPage(1);
        setActiveFilters({
            ...activeFilters,
            search: e,
        });
    };

    const fetchDeliveryCalendar = async (activeFilters) => {
        const data = new URLSearchParams();

        for (const key in activeFilters) {
            if (key === "search") {
                data.append("FILTER_OPTIONS[search]", activeFilters[key]);
            }
        }

        data.append("LIMIT", limit);
        data.append("PAGE", page);
        data.append("mode", "listDeliveryCalendar");

        try {
            const response = await crudData(data, "CommandeManager.php");
            setTotalPage(() => {
                return Math.ceil(response.data["total"] / limit);
            });
            return response.data["data"];
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const { data, isLoading } = useQuery({
        queryKey: ["DeliveryCalendar", activeFilters, page, limit],
        queryFn: () => fetchDeliveryCalendar(activeFilters),
        placeholderData: keepPreviousData,
    });

    useEffect(() => {
        if (data) {
            setCurrentData(data);
        }
    }, [data]);

    const pageNumbers = generatePageNumbers(totalPage, page);

    const handleDownloadPDF = async () => {
        if (!currentData || currentData.length === 0) {
            toast.warning("Aucune donnée à exporter");
            return;
        }

        try {
            setIsExporting(true);
            //toast.info("Génération du PDF en cours...");

            // Limiter le nombre d'éléments pour éviter les erreurs de mémoire
            const maxItems = 100;
            const dataToExport = currentData.length > maxItems
                ? currentData.slice(0, maxItems)
                : currentData;

            if (currentData.length > maxItems) {
                toast.warning(`L'export est limité aux ${maxItems} premiers calendriers pour des raisons de performance.`);
            }

            // Vérification des données avant génération
            const validData = dataToExport.map((item) => ({
                ...item,
                zone: item.zone || "N/A",
                dt_livbegin: item.dt_livbegin || "N/A",
                dt_livend: item.dt_livend || "N/A",
                cmd_count: item.cmd_count || 0,
                str_livstatut: item.str_livstatut || "open",
                lg_livid: item.lg_livid || "N/A",
            }));

            const blob = await pdf(<ListDeliveryCalendarPDF deliveryCalendars={validData} />).toBlob();
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `calendriers-livraison-${new Date().toLocaleDateString().replace(/\//g, "-")}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            //toast.success("PDF généré avec succès");
        } catch (error) {
            console.error("Erreur lors de la génération du PDF:", error);
            toast.error("Erreur lors de la génération du PDF: " + (error.message || "Erreur inconnue"));
        } finally {
            setIsExporting(false);
        }
    };
    return (
        <div className="row">
            <div className="col-lg-12">
                <h2 className="">Calendriers de livraisons</h2>
                <div className="card">
                    <div className="card-header">
                        <div className="row g-4 justify-content-between">
                            <div className="col-sm-auto">
                                <Link
                                    to="/dashboard/calendriers-livraisons/creation"
                                    className="btn btn-primary add-btn"
                                >
                                    <i className="ri-add-line align-bottom me-1"></i> Ajouter
                                </Link>

                                {selectedCheckBoxes.length > 0 && (
                                    <button
                                        className="btn btn-soft-danger ms-2"
                                        data-bs-toggle="modal"
                                        data-bs-target="#exampleModalgrid3"
                                    >
                                        <i className="ri-delete-bin-2-line"></i>
                                    </button>
                                )}
                            </div>

                            <div className="col-sm-auto">
                                <button
                                    onClick={handleDownloadPDF}
                                    type="button"
                                    className="btn btn-primary"
                                    disabled={isExporting || !currentData || currentData.length === 0}
                                >
                                    <i className="ri-file-download-line align-middle me-1"></i>
                                    {isExporting ? "Génération en cours..." : "Exporter en PDF"}
                                </button>
                            </div>
                        </div>
                        <DeleteModal
                            onHandleDeleteCalendar={handleDeleteCalendar}
                        />
                    </div>

                    <div className="card-body">
                        <div className="listjs-table" id="customerList">
                            <div className="table-responsive table-card mb-1">
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
                                                            selectedCheckBoxes.length ===
                                                            currentData.length
                                                        }
                                                        onChange={() =>
                                                            handleSelectAllCheckbox()
                                                        }
                                                    />
                                                </div>
                                            </th>
                                            <th
                                                className="sort"
                                                data-sort="customer_name"
                                            >
                                                Zone de livraison
                                            </th>
                                            <th
                                                className="sort"
                                                data-sort="phone"
                                            >
                                                Date début
                                            </th>
                                            <th
                                                className="sort"
                                                data-sort="date"
                                            >
                                                Date fin
                                            </th>
                                            <th
                                                className="sort"
                                                data-sort="status"
                                            >
                                                Nombre de commmande
                                            </th>
                                            <th
                                                className="sort"
                                                data-sort="action"
                                            >
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="list form-check-all">
                                        {currentData &&
                                            currentData.length > 0 ? (
                                            currentData.map((item, index) => (
                                                <tr key={index}>
                                                    <th scope="row">
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name={`chk_child-${index}`}
                                                                checked={selectedCheckBoxes.includes(
                                                                    index
                                                                )}
                                                                onChange={() =>
                                                                    handleSelectedCheckboxes(
                                                                        index
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </th>
                                                    <td className="customer_name">
                                                        {item.zone}
                                                    </td>
                                                    <td className="phone">
                                                        {formatDateOriginal(
                                                            item.dt_livbegin
                                                        )}{" "}
                                                        <small className="text-muted">
                                                            {
                                                                item.dt_livend.split(
                                                                    " "
                                                                )[1]
                                                            }
                                                        </small>
                                                    </td>
                                                    <td className="date">
                                                        {formatDateOriginal(
                                                            item.dt_livend
                                                        )}{" "}
                                                        <small className="text-muted">
                                                            {
                                                                item.dt_livend.split(
                                                                    " "
                                                                )[1]
                                                            }
                                                        </small>
                                                    </td>
                                                    <td className="status">
                                                        {item.cmd_count}
                                                    </td>
                                                    <td>
                                                        <div className="d-flex gap-2">
                                                            {item.str_livstatut !==
                                                                "closed" && (
                                                                    <div className="edit">
                                                                        <Link
                                                                            to={`/calendriers-livraisons/modification/${item.lg_livid}`}
                                                                            className="btn btn-sm btn-warning edit-item-btn"
                                                                        >
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                viewBox="0 0 24 24"
                                                                                fill="currentColor"
                                                                                style={{
                                                                                    width: "20px",
                                                                                }}
                                                                            >
                                                                                <path d="M6.41421 15.89L16.5563 5.74785L15.1421 4.33363L5 14.4758V15.89H6.41421ZM7.24264 17.89H3V13.6473L14.435 2.21231C14.8256 1.82179 15.4587 1.82179 15.8492 2.21231L18.6777 5.04074C19.0682 5.43126 19.0682 6.06443 18.6777 6.45495L7.24264 17.89ZM3 19.89H21V21.89H3V19.89Z"></path>
                                                                            </svg>
                                                                        </Link>
                                                                    </div>
                                                                )}

                                                            <div className="remove">
                                                                <Link
                                                                    to={`/calendriers-livraisons/consultation/${item.lg_livid}`}
                                                                    className="btn btn-sm btn-primary remove-item-btn"
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        viewBox="0 0 24 24"
                                                                        fill="currentColor"
                                                                        style={{
                                                                            width: "20px",
                                                                        }}
                                                                    >
                                                                        <path d="M12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3ZM12.0003 19C16.2359 19 19.8603 16.052 20.7777 12C19.8603 7.94803 16.2359 5 12.0003 5C7.7646 5 4.14022 7.94803 3.22278 12C4.14022 16.052 7.7646 19 12.0003 19ZM12.0003 16.5C9.51498 16.5 7.50026 14.4853 7.50026 12C7.50026 9.51472 9.51498 7.5 12.0003 7.5C14.4855 7.5 16.5003 9.51472 16.5003 12C16.5003 14.4853 14.4855 16.5 12.0003 16.5ZM12.0003 14.5C13.381 14.5 14.5003 13.3807 14.5003 12C14.5003 10.6193 13.381 9.5 12.0003 9.5C10.6196 9.5 9.50026 10.6193 9.50026 12C9.50026 13.3807 10.6196 14.5 12.0003 14.5Z"></path>
                                                                    </svg>
                                                                </Link>
                                                            </div>
                                                            {item.str_livstatut !==
                                                                "closed" && (
                                                                    <div className="remove">
                                                                        <button
                                                                            onClick={() =>
                                                                                handleCloseCalendar(
                                                                                    item.lg_livid
                                                                                )
                                                                            }
                                                                            className="btn btn-sm btn-success remove-item-btn"
                                                                        >
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                viewBox="0 0 24 24"
                                                                                fill="currentColor"
                                                                                style={{
                                                                                    width: "20px",
                                                                                }}
                                                                            >
                                                                                <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11.0026 16L6.75999 11.7574L8.17421 10.3431L11.0026 13.1716L16.6595 7.51472L18.0737 8.92893L11.0026 16Z"></path>
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : isLoading ? (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="text-center"
                                                >
                                                    Chargement des données...
                                                </td>
                                            </tr>
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="text-center"
                                                >
                                                    <div
                                                        className="noresult"
                                                        style={{
                                                            display: "block",
                                                        }}
                                                    >
                                                        <div className="text-center">
                                                            <h5 className="mt-2">
                                                                Désolé! Aucun
                                                                résultat trouvé
                                                            </h5>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div
                                className="d-flex justify-content-between mt-auto gap-2"
                                style={{ flexWrap: "wrap" }}
                            >
                                {data && data.length > 0 ? (
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
                                                    disabled={totalPage === 0}
                                                    defaultValue={limit}
                                                >
                                                    <option value="10">
                                                        10
                                                    </option>
                                                    <option value="25">
                                                        25
                                                    </option>
                                                    <option value="50">
                                                        50
                                                    </option>
                                                    <option value="100">
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
                                                        Math.max(1, page - 1)
                                                    );
                                                }}
                                                className={`page-item pagination-prev ${page - 1 === 0
                                                        ? "disabled"
                                                        : ""
                                                    }`}
                                                disabled={page - 1 === 0}
                                            >
                                                Précedent
                                            </button>
                                            <ul className="pagination listjs-pagination mb-0 d-none d-md-flex">
                                                {pageNumbers.map(
                                                    (pageNumber, index) =>
                                                        pageNumber === "..." ? (
                                                            <span
                                                                key={index}
                                                                className="dots"
                                                            >
                                                                ...
                                                            </span>
                                                        ) : (
                                                            <li
                                                                className={`${pageNumber ===
                                                                        page
                                                                        ? "active"
                                                                        : ""
                                                                    }`}
                                                                key={index}
                                                            >
                                                                <button
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
                                                                    {pageNumber}
                                                                </button>
                                                            </li>
                                                        )
                                                )}
                                            </ul>
                                            <button
                                                onClick={() => {
                                                    goToPage(
                                                        Math.min(
                                                            totalPage,
                                                            page + 1
                                                        )
                                                    );
                                                }}
                                                className={`page-item pagination-next ${page + 1 > totalPage
                                                        ? "disabled"
                                                        : ""
                                                    }`}
                                                disabled={page + 1 > totalPage}
                                            >
                                                Suivant
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    ""
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DeleteModal({ onHandleDeleteCalendar }) {
    return (
        <div
            className="modal fade"
            id="exampleModalgrid3"
            tabIndex="-1"
            aria-labelledby="exampleModalgridLabel3"
            aria-modal="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalgridLabel3">
                            Suppression
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <div className="row g-3">
                            <p>
                                Etes-vous sûr de vouloir effectuer la
                                suppression.
                            </p>
                            <div className="col-lg-12">
                                <div className="hstack gap-2 justify-content-end">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        data-bs-dismiss="modal"
                                        onClick={onHandleDeleteCalendar}
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Table = ({
    data,
    onHandleCloseCalendar,
    onHandleSelectAllCheckbox,
    selectedCheckBoxes,
    onHandleSelectedCheckboxes,
    dataCount,
}) => {
    return (
        <div className="table-responsive table-card mt-3 mb-1">
            <table
                className="table align-middle table-nowrap"
                id="customerTable"
            >
                <thead className="table-light">
                    <tr>
                        <th scope="col" style={{ width: "50px" }}>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="checkAll"
                                    checked={
                                        selectedCheckBoxes.length === dataCount
                                    }
                                    onChange={() => onHandleSelectAllCheckbox()}
                                />
                            </div>
                        </th>
                        <th className="sort" data-sort="customer_name">
                            Zone de livraison
                        </th>
                        <th className="sort" data-sort="phone">
                            Date début
                        </th>
                        <th className="sort" data-sort="date">
                            Date fin
                        </th>
                        <th className="sort" data-sort="status">
                            Nombre de commmande
                        </th>
                        <th className="sort" data-sort="action">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody className="list form-check-all">
                    {data.length > 0 ? (
                        data.map((item, index) => (
                            <tr key={index}>
                                <th scope="row">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name={`chk_child-${index}`}
                                            checked={selectedCheckBoxes.includes(
                                                index
                                            )}
                                            onChange={() =>
                                                onHandleSelectedCheckboxes(
                                                    index
                                                )
                                            }
                                        />
                                    </div>
                                </th>
                                <td className="customer_name">{item.zone}</td>
                                <td className="phone">{item.dt_livbegin}</td>
                                <td className="date">{item.dt_livend}</td>
                                <td className="status">{item.cmd_count}</td>
                                <td>
                                    <div className="d-flex gap-2">
                                        {item.str_livstatut !== "closed" && (
                                            <div className="edit">
                                                <Link
                                                    to={`/dashboard/calendriers-livraisons/modification/${item.lg_livid}`}
                                                    className="btn btn-sm btn-warning edit-item-btn"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        style={{
                                                            width: "20px",
                                                        }}
                                                    >
                                                        <path d="M6.41421 15.89L16.5563 5.74785L15.1421 4.33363L5 14.4758V15.89H6.41421ZM7.24264 17.89H3V13.6473L14.435 2.21231C14.8256 1.82179 15.4587 1.82179 15.8492 2.21231L18.6777 5.04074C19.0682 5.43126 19.0682 6.06443 18.6777 6.45495L7.24264 17.89ZM3 19.89H21V21.89H3V19.89Z"></path>
                                                    </svg>
                                                </Link>
                                            </div>
                                        )}

                                        <div className="remove">
                                            <Link
                                                to={`/dashboard/calendriers-livraisons/consultation/${item.lg_livid}`}
                                                className="btn btn-sm btn-success remove-item-btn"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                    style={{
                                                        width: "20px",
                                                    }}
                                                >
                                                    <path d="M12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3ZM12.0003 19C16.2359 19 19.8603 16.052 20.7777 12C19.8603 7.94803 16.2359 5 12.0003 5C7.7646 5 4.14022 7.94803 3.22278 12C4.14022 16.052 7.7646 19 12.0003 19ZM12.0003 16.5C9.51498 16.5 7.50026 14.4853 7.50026 12C7.50026 9.51472 9.51498 7.5 12.0003 7.5C14.4855 7.5 16.5003 9.51472 16.5003 12C16.5003 14.4853 14.4855 16.5 12.0003 16.5ZM12.0003 14.5C13.381 14.5 14.5003 13.3807 14.5003 12C14.5003 10.6193 13.381 9.5 12.0003 9.5C10.6196 9.5 9.50026 10.6193 9.50026 12C9.50026 13.3807 10.6196 14.5 12.0003 14.5Z"></path>
                                                </svg>
                                            </Link>
                                        </div>
                                        {item.str_livstatut !== "closed" && (
                                            <div className="remove">
                                                <button
                                                    onClick={() =>
                                                        onHandleCloseCalendar(
                                                            item.lg_livid
                                                        )
                                                    }
                                                    className="btn btn-sm btn-primary remove-item-btn"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        style={{
                                                            width: "20px",
                                                        }}
                                                    >
                                                        <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11.0026 16L6.75999 11.7574L8.17421 10.3431L11.0026 13.1716L16.6595 7.51472L18.0737 8.92893L11.0026 16Z"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={6}
                                className="text-center"
                                style={{ fontSize: "18px" }}
                            >
                                <p>Aucune données trouvées</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

const PaginatedTable = TableWithPaginationHOC(Table);

export default Planning;
