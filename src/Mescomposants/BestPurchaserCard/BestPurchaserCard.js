import React, { useEffect, useState } from "react";
import { fetchPurchaserStats } from "../../api/Stat";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
    defaultImageLink,
    formatPrice,
    generatePageNumbers,
    verifyImageLink,
} from "../../services/lib";
import { fullUrl } from "../../services/apiService";

function BestPurchaserCard() {
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState();
    const [year, setYear] = useState("2020");
    const [total, setTotal] = useState();
    const [totalPage, setTotalPage] = useState();

    const handleChangeLimit = (limit) => {
        setLimit(limit);
    };

    const goToPage = (page) => {
        setPage(page);
    };

    const handleChangeSearch = (value) => {
        setSearch(value);
    };

    const handleChangeYear = (intMonth) => {
        setYear(intMonth);
    };

    const { data, isLoading, isFetching } = useQuery({
        queryKey: ["purchaser", limit, page, search, year],
        queryFn: () => fetchPurchaserStats(limit, page, search, year),
        placeholderData: keepPreviousData,
    });

    useEffect(() => {
        if (data !== null && data !== undefined) {
            setTotal(data.total);
            setTotalPage(() => {
                return Math.ceil(data.total / limit);
            });
            //console.log("hey");
        }
    }, [data]);

    const pageNumbers = generatePageNumbers(totalPage, page);
    return (
        <div className="col-xl-6">
            <div className="card card-height-100">
                <div className="card-header align-items-center d-flex">
                    <h4 className="card-title mb-0 flex-grow-1">
                        Meilleurs clients
                    </h4>
                    <div className="flex-shrink-0 ms-2">
                        <div className="dropdown card-header-dropdown">
                            <button
                                className="btn btn-soft-primary btn-sm"
                                data-bs-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                            >
                                {!year ? "Tous" : year}
                                <i className="mdi mdi-chevron-down align-middle ms-1" />
                            </button>
                            <div className="dropdown-menu dropdown-menu-end">
                                <button
                                    className="dropdown-item"
                                    onClick={() => handleChangeYear(null)}
                                >
                                    Tous
                                </button>
                                {[
                                    "2020",
                                    "2021",
                                    "2022",
                                    "2023",
                                    "2024",
                                    "2025",
                                ].map(
                                    (m, index) =>
                                        index + 1 !== year && (
                                            <button
                                                className="dropdown-item"
                                                onClick={() =>
                                                    handleChangeYear(index + 1)
                                                }
                                                key={index}
                                            >
                                                {m}
                                            </button>
                                        )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-header align-items-center d-flex justify-content-between">
                    <div className="form-group">
                        <div className="search-box">
                            <input
                                type="text"
                                className="form-control search bg-light border-light"
                                placeholder="Rechercher par nom"
                                name="search"
                                onChange={(e) => {
                                    handleChangeSearch(e.target.value);
                                }}
                            />
                            <i className="ri-search-line search-icon"></i>
                        </div>
                    </div>
                    <div className="flex-shrink-0 ms-2 ">
                        <label htmlFor="" className="d-inline-block">
                            Limit :{" "}
                        </label>
                        <div className="dropdown card-header-dropdown d-inline-block">
                            <button
                                className="btn btn-soft-primary btn-sm"
                                data-bs-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                            >
                                {limit}
                                <i className="mdi mdi-chevron-down align-middle ms-1" />
                            </button>
                            <div className="dropdown-menu dropdown-menu-end">
                                {[10, 25, 50, 100].map(
                                    (elem, index) =>
                                        elem !== limit && (
                                            <button
                                                className="dropdown-item"
                                                onClick={() =>
                                                    handleChangeLimit(elem)
                                                }
                                                key={index}
                                            >
                                                {elem}
                                            </button>
                                        )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <div className="table-responsive table-card">
                        {data && data?.data?.length > 0 ? (
                            <table className="table table-hover table-borderless table-centered align-middle table-nowrap mb-0 position-relative">
                                <div
                                    className={`${
                                        isFetching ? "d-block" : "d-none"
                                    } text-center position-absolute`}
                                    style={{
                                        translate: "-50% -50%",
                                        top: "50%",
                                        left: "50%",
                                    }}
                                >
                                    <div>
                                        <svg
                                            className="spinner-border"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            width={64}
                                            height={64}
                                        >
                                            <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
                                        </svg>
                                    </div>
                                    <h5 className="mt-2">
                                        Chargement des données
                                    </h5>
                                </div>
                                <thead className="text-muted bg-light-subtle">
                                    <tr>
                                        <th className="text-white text-uppercase">
                                            Nom
                                        </th>
                                        <th className="text-white text-uppercase">
                                            Contact
                                        </th>
                                        <th className="text-white text-uppercase">
                                            Commandes
                                        </th>
                                        <th className="text-white text-uppercase">
                                            Montant Total
                                        </th>
                                        {/* <th className="text-white text-uppercase">Pourcentage / 100</th> */}
                                    </tr>
                                </thead>

                                <tbody
                                    className={`${
                                        isFetching ? "opacity-50" : ""
                                    } position-relative`}
                                >
                                    {data &&
                                        data.data.map((purchaser,index) => (
                                            <tr key={index}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div>
                                                            <h6 className="fs-14 mb-0">
                                                                {
                                                                    purchaser.UTIFIRSTLASTNAME
                                                                }
                                                            </h6>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="">
                                                    {purchaser.SOCPHONE}
                                                </td>
                                                <td className="text-center">
                                                    {purchaser.TOTAL_CMD}
                                                </td>
                                                <td className="fw-bold">
                                                    {formatPrice(
                                                        purchaser.TOTAL_AMOUNT
                                                    )}{" "}
                                                    FCFA
                                                </td>
                                                {/* <td>
                                                    <h6 className="text-success fs-13 mb-0">
                                                        <i className="mdi mdi-eye-check-outline align-middle me-1" />
                                                        {purchaser.TOTAL_CMD * 100 / }
                                                    </h6>
                                                </td> */}
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        ) : isLoading ? (
                            <div
                                className="noresult my-4"
                                style={{
                                    display: "block",
                                }}
                            >
                                <div className="text-center">
                                    <div>
                                        <svg
                                            className="spinner-border"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            width={64}
                                            height={64}
                                        >
                                            <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
                                        </svg>
                                    </div>
                                    <h5 className="mt-2">
                                        Chargement des données
                                    </h5>
                                </div>
                            </div>
                        ) : (
                            <div
                                className="noresult my-4"
                                style={{
                                    display: "block",
                                }}
                            >
                                <div className="text-center">
                                    <div>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            width={64}
                                            height={64}
                                        >
                                            <path d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z" />
                                        </svg>
                                    </div>
                                    <h5 className="mt-2">
                                        Désolé, aucun resultat trouvé
                                    </h5>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {data?.data && data?.data?.length > 0 && (
                    <div className="card-footer">
                        <div className="align-items-center pt-2 justify-content-between row text-center text-sm-start">
                            <div className="col-sm">
                                <div className="text-muted">
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
                            </div>
                            <div className="col-sm-auto  mt-3 mt-sm-0">
                                <ul className="pagination pagination-separated pagination-sm mb-0 justify-content-center">
                                    <li
                                        className={`page-item ${
                                            page === 1 ? "disabled" : ""
                                        }`}
                                    >
                                        <button
                                            onClick={() => {
                                                goToPage(Math.max(1, page - 1));
                                            }}
                                            className="page-link m-0"
                                            style={{
                                                fontSize: "0.875em",
                                                width: "100%",
                                                height: "100%",
                                            }}
                                        >
                                            Prec
                                        </button>
                                    </li>
                                    <ul className="pagination listjs-pagination mb-0 d-none d-md-flex me-2 ms-2">
                                        {pageNumbers.map((pageNumber, index) =>
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
                                                        pageNumber === page
                                                            ? "active"
                                                            : ""
                                                    }`}
                                                    key={index}
                                                >
                                                    <button
                                                        onClick={() =>
                                                            goToPage(pageNumber)
                                                        }
                                                        className={`page-link
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
                                    <li
                                        className={`page-item ${
                                            page === totalPage ? "disabled" : ""
                                        }`}
                                    >
                                        <button
                                            onClick={() =>
                                                goToPage(
                                                    Math.min(
                                                        totalPage,
                                                        page + 1
                                                    )
                                                )
                                            }
                                            className="page-link m-0"
                                            style={{
                                                fontSize: "0.875em",
                                                width: "100%",
                                                height: "100%",
                                            }}
                                        >
                                            Suiv
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default BestPurchaserCard;
