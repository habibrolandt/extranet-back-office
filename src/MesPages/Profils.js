import { useEffect, useRef, useState } from "react";
import { crudData, doRequest, fullUrl } from "../services/apiService";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
    formatPrice,
    generatePageNumbers,
    isImageAvailable,
} from "../services/lib";
import { toast } from "react-toastify";
import { deleteProfil } from "../api/Profil";

function Profils() {
    const navigate = useNavigate();
    const [totalPage, setTotalPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();
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
    const [toBeDeleted, setToBeDeleted] = useState(null);

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

    const fetchProducts = async (activeFilters) => {
        const data = new URLSearchParams();

        for (const key in activeFilters) {
            if (key === "search") {
                data.append("FILTER_OPTIONS[search]", activeFilters[key]);
            }
        }

        data.append("LIMIT", limit);
        data.append("PAGE", page);
        data.append("mode", "listProfile");

        try {
            const response = await crudData(data, "ConfigurationManager.php");
            setTotal(response.data.total);
            setTotalPage(() => {
                return Math.ceil(response.data["total"] / limit);
            });
            return response.data.data;
        } catch (error) {
            console.error(error);
        }
    };

    const { data, isLoading } = useQuery({
        queryKey: ["profils", activeFilters, page, limit],
        queryFn: () => fetchProducts(activeFilters),
        placeholderData: keepPreviousData,
    });

    const [profils, setProfils] = useState(data || null);

    useEffect(() => {
        if (data) {
            setProfils(data);
        }
    }, [data]);

    useEffect(() => {
        const user = localStorage.getItem("user");

        if (!user) {
            navigate("/");
        }
    }, [navigate]);

    const pageNumbers = generatePageNumbers(totalPage, page);

    const handleChangeToBeDeleted = (data) => {
        setToBeDeleted(data);
    };

    const handleDeleteProfil = (LG_PROID) => {
        const response = deleteProfil(LG_PROID);
        response.then((res) => {
            if (res === true) {
                toast.success("Profil supprimé avec succès");
                const newProfils = data.filter(
                    (profil) => profil.PROID !== LG_PROID
                );
                setProfils(newProfils);
                setTotal((oldToatal) => total - 1);
            }
        });
    };

    return (
        <div className="row justify-content-center">
            <h1>Liste profils</h1>
            <div className="col-xxl-12">
                <div className="card" id="invoiceList">
                    <div className="card-header">
                        <DeleteModal
                            deletedElement={toBeDeleted}
                            onHandleDeleteOne={handleDeleteProfil}
                        />
                        <div className="text-end">
                            <Link
                                to={"/profils/creation"}
                                className="btn btn-primary"
                            >
                                <i className="ri-add-line me-1 align-middle"></i>
                                Ajouter
                            </Link>
                        </div>
                    </div>
                    <div className="card-body bg-light-subtle border border-dashed border-start-0 border-end-0">
                        <form id="filter-form">
                            <div className="row g-3 align-items-center">
                                <div className="col-xxl-8 col-sm-12">
                                    <div className="search-box">
                                        <input
                                            type="text"
                                            className="form-control search bg-light border-light"
                                            placeholder="Rechercher..."
                                            name="search"
                                            value={activeFilters.search || ""}
                                            onChange={(e) => {
                                                handleSearch(e.target.value);
                                            }}
                                        />
                                        <i className="ri-search-line search-icon"></i>
                                    </div>
                                </div>
                                <div className="col-xxl-4 col-sm-4 text-end">
                                    <label className="align-items-center">
                                        Montrer{" "}
                                        <select
                                            name="alternative-pagination_length"
                                            aria-controls="alternative-pagination"
                                            className="form-select form-select-sm d-inline-block"
                                            style={{ width: 75 }}
                                            onChange={(e) => {
                                                handleSetLimit(e.target.value);
                                            }}
                                        >
                                            <option
                                                value="10"
                                                selected={limit === 10}
                                            >
                                                10
                                            </option>
                                            <option
                                                value="25"
                                                selected={limit === 25}
                                            >
                                                25
                                            </option>
                                            <option
                                                value="50"
                                                selected={limit === 50}
                                            >
                                                50
                                            </option>
                                            <option
                                                value="100"
                                                selected={limit === 100}
                                            >
                                                100
                                            </option>
                                        </select>{" "}
                                        entrées
                                    </label>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="card-body">
                        <div
                            className="d-flex flex-column"
                            style={{ minHeight: 600 }}
                        >
                            <div className="table-responsive table-card mb-3">
                                {profils && profils.length > 0 ? (
                                    <table
                                        className="table align-middle table-nowrap"
                                        id="invoiceTable"
                                    >
                                        <thead className="text-muted">
                                            <tr>
                                                <th className="text-uppercase th-text-color">
                                                    Code
                                                </th>
                                                <th className="text-uppercase th-text-color">
                                                    Description
                                                </th>
                                                <th className="text-uppercase th-text-color">
                                                    Type
                                                </th>
                                                <th className="text-uppercase th-text-color">
                                                    Nombre d'utilisateurs
                                                </th>
                                                <th className="text-uppercase th-text-color">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody
                                            className="list form-check-all"
                                            id="invoice-list-data"
                                        >
                                            {profils && profils.length > 0
                                                ? profils.map(
                                                      (profil, index) => (
                                                          <tr>
                                                              <td>
                                                                  {
                                                                      profil.PRONAME
                                                                  }
                                                              </td>
                                                              <td>
                                                                  {
                                                                      profil.PRODESCRIPTION
                                                                  }
                                                              </td>
                                                              <td>
                                                                  {
                                                                      profil.PROTYPE
                                                                  }
                                                              </td>
                                                              <td>A/C</td>
                                                              <td>
                                                                  <Link
                                                                      to={`/profils/modification/${profil.PROID}`}
                                                                      className="btn btn-warning me-2"
                                                                  >
                                                                      <i class="ri-edit-box-line"></i>
                                                                  </Link>
                                                                  <button
                                                                      className="btn btn-danger"
                                                                      data-bs-toggle="modal"
                                                                      data-bs-target="#exampleModalgrid3"
                                                                      onClick={() => {
                                                                          handleChangeToBeDeleted(
                                                                              profil
                                                                          );
                                                                      }}
                                                                  >
                                                                      <i class="ri-delete-bin-2-line"></i>
                                                                  </button>
                                                              </td>
                                                          </tr>
                                                      )
                                                  )
                                                : ""}
                                        </tbody>
                                    </table>
                                ) : isLoading ? (
                                    <div
                                        className="text-center"
                                        style={{
                                            display: "block",
                                            marginTop: "120px",
                                        }}
                                    >
                                        <div
                                            className="spinner-border"
                                            style={{
                                                width: "3em",
                                                height: "3em",
                                            }}
                                            role="status"
                                        >
                                            <span class="visually-hidden">
                                                Loading...
                                            </span>
                                        </div>
                                        <h5 className="mt-2">
                                            Chargement des données...
                                        </h5>
                                    </div>
                                ) : (
                                    <div
                                        className="noresult"
                                        style={{
                                            display: "block",
                                            marginTop: "120px",
                                        }}
                                    >
                                        <div className="text-center">
                                            <div>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                    style={{ width: 72 }}
                                                >
                                                    <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z"></path>
                                                </svg>
                                            </div>
                                            <h5 className="mt-2">
                                                Aucun résultat trouvé
                                            </h5>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="d-flex justify-content-between mt-auto">
                                {profils && profils.length > 0 ? (
                                    <>
                                        <div
                                            role="status"
                                            aria-live="polite"
                                            className="gridjs-summary"
                                            title="Page 2 of 2"
                                        >
                                            Affichage de{" "}
                                            <b>{limit * page - (limit - 1)}</b>{" "}
                                            à{" "}
                                            <b>
                                                {limit * page > total
                                                    ? total
                                                    : limit * page}{" "}
                                            </b>{" "}
                                            sur <b>{total}</b> resultats
                                        </div>
                                        <div className="pagination-wrap hstack gap-2">
                                            <button
                                                onClick={() => {
                                                    goToPage(
                                                        Math.max(1, page - 1)
                                                    );
                                                }}
                                                className={`page-item pagination-prev ${
                                                    page - 1 === 0
                                                        ? "disabled"
                                                        : ""
                                                }`}
                                                disabled={page - 1 === 0}
                                            >
                                                Précedent
                                            </button>
                                            <ul className="pagination listjs-pagination mb-0">
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
                                                                className={`${
                                                                    pageNumber ===
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
                                                className={`page-item pagination-next ${
                                                    page + 1 > totalPage
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

function DeleteModal({
    deletedElement = null,
    onHandleDeleteOne,
    onHandleDeleteAll,
}) {
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
                                Etes-vous sûr de vouloir supprimer ce profil (
                                <b>{deletedElement?.PRODESCRIPTION}</b>).
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
                                        onClick={
                                            deletedElement?.PROID !== null
                                                ? () =>
                                                      onHandleDeleteOne(
                                                          deletedElement?.PROID
                                                      )
                                                : onHandleDeleteAll
                                        }
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

export default Profils;
