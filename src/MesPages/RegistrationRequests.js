import { useEffect, useState } from "react";
import { crudData, doRequest, mode } from "../services/apiService";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import TableRow from "../Mescomposants/TableRow";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { generatePageNumbers } from "../services/lib";

function Demandes() {
    const navigate = useNavigate();
    const url = useLocation();
    const pathParts = url.pathname.split("/");
    const lastPart = pathParts[pathParts.length - 1];
    const [totalPage, setTotalPage] = useState(0);
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
    const [limit, setLimit] = useState(() => {
        return searchParams.get("limit") || 10;
    });
    const [page, setPage] = useState(() => {
        return searchParams.get("page") || 1;
    });

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
        params.set("search", e);
        params.set("page", 1);
        setSearchParams(params);
        setPage(1);
        setActiveFilters((prev) => ({ ...prev, search: e }));
    };

    const fetchDemandes = async (activeFilters) => {
        const data = new URLSearchParams();

        for (const key in activeFilters) {
            console.log(key);
            if (key === "search") {
                data.append("FILTER_OPTIONS[search]", activeFilters[key]);
            }
        }

        const requestStatus = lastPart === "approuvées" ? "enable" : "process";
        data.append("FILTER_OPTIONS[status]", requestStatus);
        data.append("mode", mode.getClientDemandesMode);
        data.append("LIMIT", limit);
        data.append("PAGE", page);

        try {
            const response = await crudData(data, "ConfigurationManager.php");
            setTotalPage(() => {
                return Math.ceil(response.data.total / limit);
            });

            return response.data.demandes;
        } catch (error) {
            console.log(error);
        }
    };

    const { data, isLoading } = useQuery({
        queryKey: ["demandes", activeFilters, page, limit],
        queryFn: () => fetchDemandes(activeFilters),
        placeholderData: keepPreviousData,
    });

    useEffect(() => {
        const user = localStorage.getItem("user");

        if (!user) {
            navigate("/");
        }
    }, [navigate]);

    const pageNumbers = generatePageNumbers(totalPage, page);

    return (
        <div className="row">
            <div className="col-lg-12">
                <h2>Demandes de creation de compte</h2>
                <div className="card" id="invoiceList">
                    <div className="card-body bg-light-subtle border border-dashed border-start-0 border-end-0">
                        <form
                            onSubmit={(e) => e.preventDefault()}
                            id="filter-form"
                        >
                            <div className="row g-3">
                                <div className="col-xxl-8 col-sm-8">
                                    <div className="search-box">
                                        <input
                                            type="text"
                                            className="form-control search bg-light border-light"
                                            placeholder="Rechercher par libéllé société, adresse email"
                                            name="search"
                                            value={activeFilters.search || ""}
                                            onChange={(e) =>
                                                handleSearch(e.target.value)
                                            }
                                        />
                                        <i className="ri-search-line search-icon"></i>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="card-body">
                        <div>
                            <div className="table-responsive table-card">
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
                                                Libéllé société
                                            </th>
                                            <th className="text-uppercase th-text-color">
                                                Adresse email
                                            </th>
                                            <th className="text-uppercase th-text-color">
                                                Date de demande
                                            </th>
                                            <th className="text-uppercase th-text-color">
                                                Statut de demande
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
                                        {data && data.length > 0 ? (
                                            data.map((demande, index) => {
                                                return (
                                                    <TableRow
                                                        demande={demande}
                                                        key={index}
                                                    />
                                                );
                                            })
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
                                className="d-flex justify-content-between mt-3 gap-2"
                                style={{ flexWrap: "wrap" }}
                            >
                                {data && (
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
                                        <div className="pagination-wrap hstack gap-2">
                                            <button
                                                onClick={() =>
                                                    goToPage(
                                                        Math.max(1, page - 1)
                                                    )
                                                }
                                                className={`page-item pagination-prev ${
                                                    page === 1 ? "disabled" : ""
                                                }`}
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
                                                onClick={() =>
                                                    goToPage(
                                                        Math.min(
                                                            totalPage,
                                                            page + 1
                                                        )
                                                    )
                                                }
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

export default Demandes;
