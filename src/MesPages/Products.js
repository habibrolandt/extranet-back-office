import { useEffect, useState } from "react";
import { crudData, doRequest, fullUrl } from "../services/apiService";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
    formatPrice,
    generatePageNumbers,
    isImageAvailable,
} from "../services/lib";

export async function produitsLoader() {
    let data = null;
    const params = {
        mode: "listProduct",
        LIMIT: 10,
        PAGE: 1,
    };
    try {
        const response = await doRequest(params, "StockManager.php");
        data = response.data["products"];
    } catch (error) {
        console.error(error);
    }
    console.log(data);

    return { data };
}

function Products() {
    const navigate = useNavigate();
    // const topRef = useRef(null);
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
        data.append("mode", "listProduct");

        try {
            const response = await crudData(data, "StockManager.php");
            setTotal(response.data.total);
            setTotalPage(() => {
                return Math.ceil(response.data["total"] / limit);
            });
            return response.data["products"];
        } catch (error) {
            console.error(error);
        }
    };

    const { data, isLoading } = useQuery({
        queryKey: ["products", activeFilters, page, limit],
        queryFn: () => fetchProducts(activeFilters),
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
        <>
            <h2>Liste des produits</h2>
            <div className="card" id="invoiceList">
                <div className="card-body bg-light-subtle border border-dashed border-start-0 border-end-0">
                    <form id="filter-form">
                        <div className="row g-3 align-items-center">
                            <div className="col-xxl-8 col-sm-12">
                                <div className="search-box">
                                    <input
                                        type="text"
                                        className="form-control search bg-light border-light"
                                        placeholder="Rechercher par nom, categorie, gamme, espèce"
                                        name="search"
                                        value={activeFilters.search || ""}
                                        onChange={(e) => {
                                            handleSearch(e.target.value);
                                        }}
                                    />
                                    <i className="ri-search-line search-icon"></i>
                                </div>
                            </div>

                            <div className="col-xxl-4 col-sm-4">
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
                        style={{ minHeight: 667 }}
                    >
                        <div className="table-responsive table-card">
                            <table
                                className="table align-middle table-nowrap"
                                id="invoiceTable"
                            >
                                <thead className="text-muted">
                                    <tr>
                                        <th className="text-uppercase th-text-color">
                                            Nom
                                        </th>
                                        <th className="text-uppercase th-text-color">
                                            Categorie
                                        </th>
                                        <th className="text-uppercase th-text-color">
                                            Gamme
                                        </th>
                                        <th className="text-uppercase th-text-color">
                                            Espèces
                                        </th>
                                        <th className="text-uppercase th-text-color">
                                            Prix de vente
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
                                    {data && data.length > 0
                                        ? data.map((produit, index) => {
                                              return (
                                                  <TableRow
                                                      produit={produit}
                                                      key={index}
                                                  />
                                              );
                                          })
                                        : ""}
                                </tbody>
                            </table>
                            <div
                                className="noresult"
                                style={{
                                    display: "none",
                                }}
                            >
                                <div className="text-center">
                                    <lord-icon
                                        src="../../../../cdn.lordicon.com/msoeawqm.json"
                                        trigger="loop"
                                        colors="primary:#25a0e2,secondary:#00bd9d"
                                        style={{
                                            width: 75,
                                            height: 75,
                                        }}
                                    ></lord-icon>
                                    <h5 className="mt-2">
                                        Désolé, aucun resultat trouvé
                                    </h5>
                                    <p className="text-muted mb-0">
                                        We've searched more than 150+ invoices
                                        We did not find any invoices for you
                                        search.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div
                            className="d-flex justify-content-between mt-auto gap-2"
                            style={{ flexWrap: "wrap" }}
                        >
                            {data && data.length > 0 ? (
                                <>
                                    <div
                                        role="status"
                                        aria-live="polite"
                                        className="gridjs-summary"
                                        title="Page 2 of 2"
                                    >
                                        Affichage de{" "}
                                        <b>{limit * page - (limit - 1)}</b> à{" "}
                                        <b>
                                            {" "}
                                            {limit * page > total
                                                ? total
                                                : limit * page}
                                        </b>{" "}
                                        sur <b>{total}</b> resultats
                                    </div>
                                    <div className="pagination-wrap hstack gap-2">
                                        <button
                                            onClick={() => {
                                                goToPage(Math.max(1, page - 1));
                                            }}
                                            className={`page-item pagination-prev ${
                                                page - 1 === 0 ? "disabled" : ""
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
                                                                onClick={() =>
                                                                    goToPage(
                                                                        pageNumber
                                                                    )
                                                                }
                                                                className={`page
                                                                    }`}
                                                                details="0"
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
        </>
    );
}

function TableRow({ produit }) {
    const [isAvailable, setIsAvailable] = useState(null);

    useEffect(() => {
        const checkImage = async () => {
            const available = await isImageAvailable(
                fullUrl + produit.ArtGPicID
            );
            setIsAvailable(available);
        };

        if (produit.ArtGPicID) {
            checkImage();
        } else {
            setIsAvailable(false);
        }
    }, [produit.ArtGPicID]);

    return (
        <tr>
            <td className="customer_name">
                <div className="d-flex align-items-center">
                    {isAvailable ? (
                        <img
                            src={fullUrl + produit.ArtGPicID}
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

                    {produit.ArtLib}
                </div>
            </td>
            <td className="email">{produit.ArtCateg}</td>
            <td className="profil">{produit.ArtGamme}</td>
            <td className="especes">{produit.ArtSpecies}</td>

            <td className="id">
                {produit.ArtLastPA
                    ? formatPrice(produit.ArtLastPA) + " FCFA"
                    : null}
            </td>
            <td>
                <div className="dropdown">
                    <Link
                        to={`/produits/modification/${produit.ArtID}`}
                        className="btn btn-soft-secondary btn-sm dropdown btn-details"
                    >
                        Details
                        <i className="ri-arrow-right-line align-middle"></i>
                    </Link>
                </div>
            </td>
        </tr>
    );
}

export default Products;
