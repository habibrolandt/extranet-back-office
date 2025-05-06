import { useEffect, useState } from "react";
import { crudData, urlBaseImage } from "../services/apiService";
import {
    Link,
    useSearchParams,
} from "react-router-dom";
import {
    formatDateOriginal,
    generatePageNumbers,
    hasPrivilege,
} from "../services/lib";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { deleteUser } from "../api/User";
import { toast } from "react-toastify";
import usePrivilegesState from "../store/privilegesState";

function ListUser() {
    const privileges = usePrivilegesState((state) => state.privileges);

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
            if (key === "categories") {
                activeFilters[key].forEach((value) => {
                    data.append("FILTER_OPTIONS[str_procateg][]", value);
                });
            }
            if (key === "especes") {
                activeFilters[key].forEach((value) => {
                    data.append("FILTER_OPTIONS[str_proespece][]", value);
                });
            }
            if (key === "gammes") {
                activeFilters[key].forEach((value) => {
                    data.append("FILTER_OPTIONS[str_progamme][]", value);
                });
            }
        }

        data.append("LIMIT", limit);
        data.append("PAGE", page);
        data.append("mode", "listUsers");

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
        queryKey: ["products", activeFilters, page, limit],
        queryFn: () => fetchProducts(activeFilters),
        placeholderData: keepPreviousData,
    });

    const [users, setUsers] = useState(data || null);

    useEffect(() => {
        if (data) {
            setUsers(data);
        }
    }, [data]);

    const pageNumbers = generatePageNumbers(totalPage, page);

    const handleChangeToBeDeleted = (data) => {
        setToBeDeleted(data);
    };

    const handleDeleteUser = (LG_UTIID) => {
        const response = deleteUser(LG_UTIID);
        response.then((res) => {
            if (res === true) {
                toast.success("Utilisateur supprimé avec succès");
                const newUsers = data.filter((user) => user.UTIID !== LG_UTIID);
                setUsers(newUsers);
                setTotal((oldToatal) => total - 1);
            }
        });
    };

    return (
        <div className="row">
            <div className="col-lg-12">
                <h2>Liste des utilisateurs</h2>
                <div className="card" id="invoiceList">
                    <DeleteModal
                        deletedElement={toBeDeleted}
                        onHandleDeleteOne={handleDeleteUser}
                    />
                    <div className="card-header rounded-top bg-light-subtle border-bottom border-start-0 border-end-0">
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
                                <div className="col-xxl-2 col-sm-2">
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

                                {privileges &&
                                    hasPrivilege(privileges, "createUser") && (
                                        <div className="text-md-end col-xxl-2 col-sm-2">
                                            <Link
                                                to={"/utilisateurs/creation"}
                                                className="btn btn-primary"
                                            >
                                                <i className="ri-add-line me-1 align-middle"></i>
                                                Ajouter
                                            </Link>
                                        </div>
                                    )}
                            </div>
                        </form>
                    </div>
                    <div className="card-body">
                        <div>
                            <div className="table-responsive table-card">
                                {users && users.length > 0 ? (
                                    <table
                                        className="table align-middle table-nowrap"
                                        id="invoiceTable"
                                    >
                                        <thead className="text-muted">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    style={{
                                                        width: 50,
                                                    }}
                                                >
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="checkAll"
                                                            defaultValue="option"
                                                        />
                                                    </div>
                                                </th>
                                                <th className="text-uppercase th-text-color">
                                                    Nom complet
                                                </th>
                                                <th className="text-uppercase th-text-color">
                                                    Adresse email
                                                </th>
                                                <th className="text-uppercase th-text-color">
                                                    Contact
                                                </th>
                                                <th className="text-uppercase th-text-color">
                                                    Profil
                                                </th>
                                                <th className="text-uppercase th-text-color">
                                                    Date d'inscription
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
                                            {users && users.length > 0
                                                ? users.map((user, index) => (
                                                      <TableRow
                                                          data={user}
                                                          key={index}
                                                          onChangeToBeDeleted={
                                                              handleChangeToBeDeleted
                                                          }
                                                      />
                                                  ))
                                                : ""}
                                        </tbody>
                                    </table>
                                ) : isLoading ? (
                                    <div
                                        className="text-center"
                                        style={{
                                            display: "block",
                                            // marginTop: "120px",
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
                            <div
                                className="d-flex justify-content-between mt-3 gap-2"
                                style={{ flexWrap: "wrap" }}
                            >
                                {users && users.length > 0 ? (
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
                                                    : limit * page}
                                            </b>{" "}
                                            sur <b>{total}</b> resultats
                                        </div>
                                        <div className="pagination-wrap hstack gap-2">
                                            <button
                                                type="button"
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
                                                                className={`${
                                                                    pageNumber ===
                                                                    page
                                                                        ? "active"
                                                                        : ""
                                                                }`}
                                                                key={index}
                                                            >
                                                                {/* <buttonn class="page" href="#" data-i="1" data-page="8">
                                                                </buttonn> */}
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
                                                                    {pageNumber}
                                                                </button>
                                                            </li>
                                                        )
                                                )}
                                            </ul>
                                            <button
                                                type="button"
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
            {/*end col*/}
        </div>
    );
}

function TableRow({ data, onChangeToBeDeleted }) {
    const privileges = usePrivilegesState((state) => state.privileges);
    const currentUser = JSON.parse(localStorage.getItem("user"));

    return (
        <tr>
            <th scope="row">
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        name="chk_child"
                        defaultValue="#VL25000365"
                    />
                </div>
            </th>
            <td className="customer_name">
                <div className="d-flex align-items-center">
                    {data.UTIPIC ? (
                        <img
                            src={`${urlBaseImage}images/avatars/${data.UTIID}/${data.UTIPIC}`}
                            alt=""
                            className="avatar-xs rounded-circle me-2"
                        />
                    ) : (
                        <img
                            src="default.jpeg"
                            alt=""
                            className="avatar-xs rounded-circle me-2"
                        />
                    )}
                    {data.UTIFIRSTLASTNAME}
                </div>
            </td>
            <td className="email">{data.UTIMAIL}</td>
            <td className="profil">{data.UTIPHONE}</td>
            <td className="id">{data.UTIPROFIL}</td>
            <td className="date">
                {formatDateOriginal(data.UTICREATED)}{" "}
                <small className="text-muted">
                    {data.UTICREATED.split(" ")[1]}
                </small>
            </td>
            <td>
                {currentUser.LG_UTIID !== data.UTIID && (
                    <td>
                        {privileges &&
                            hasPrivilege(privileges, "modifyUsers") && (
                                <Link
                                    to={`/utilisateurs/modification/${data.UTIID}`}
                                    className="btn btn-warning me-2"
                                >
                                    <i class="ri-edit-box-line"></i>
                                </Link>
                            )}
                        {privileges &&
                            hasPrivilege(privileges, "deleteUsers") && (
                                <button
                                    className="btn btn-danger"
                                    data-bs-toggle="modal"
                                    data-bs-target="#exampleModalgrid3"
                                    onClick={() => {
                                        onChangeToBeDeleted(data);
                                    }}
                                >
                                    <i class="ri-delete-bin-2-line"></i>
                                </button>
                            )}
                    </td>
                )}
            </td>
        </tr>
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
                                <b>{deletedElement?.UTIFIRSTLASTNAME}</b>).
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
                                            deletedElement?.UTIID !== null
                                                ? () =>
                                                      onHandleDeleteOne(
                                                          deletedElement?.UTIID
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

export default ListUser;
