import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { doRequest, rootUrl } from "../services/apiService";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import React from "react";
import TableWithPaginationHOC from "../Mescomposants/TableWithPaginationHOC/TableWithPaginationHOC";
import axiosInstance from "../axiosInstance";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { formatDateOriginal, generatePageNumbers } from "../services/lib";

export async function consultationLivCalLoader({ params }) {
    let data = null;
    let data2 = null;

    const formData1 = new FormData();
    formData1.append("mode", "listeCommandeLocal");
    formData1.append("FILTER_OPTIONS[lg_livcommid]", params.ID);
    formData1.append("LIMIT", 10);
    formData1.append("PAGE", 1);

    const formData2 = new FormData();
    formData2.append("mode", "listDeliveryCalendar");
    formData2.append("LG_LIVID", params.ID);
    formData2.append("LIMIT", 10);
    formData2.append("PAGE", 1);

    try {
        const [response1, response2] = await Promise.all([
            axios.post(`${rootUrl}CommandeManager.php`, formData1),
            axios.post(`${rootUrl}CommandeManager.php`, formData2),
        ]);
        data = response1.data["data"];
        data2 = response2.data["data"];
    } catch (error) {
        console.error(error);
    }

    return { data, data2 };
}

function ConsultationDelivery() {
    const navigate = useNavigate();
    const { ID } = useParams();
    const [deliveryCalendar, setDeliveryCalendar] = useState(null);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(null);
    const [total, setTotal] = useState(null);
    const [orders, setOrders] = useState(null);

    const goToPage = (page) => {
        setPage(page);
    };

    const handleChangeLimit = (limit) => {
        setLimit(limit);
    };

    useEffect(() => {
        const fetchDeliveryCalendar = async () => {
            try {
                const response = await axiosInstance.post(
                    `CommandeManager.php`,
                    {
                        //lg_livid
                        mode: "listDeliveryCalendar",
                        "FILTER_OPTIONS[lg_livid]": ID,
                        LIMIT: 10,
                        PAGE: 1,
                    },
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                setDeliveryCalendar(response.data.data[0]);
            } catch (error) {
                toast.log(error.message);
            }
        };

        fetchDeliveryCalendar();
    }, [ID]);

    const fetchOrders = async (limit, page) => {
        try {
            const response = await axiosInstance.post(
                `CommandeManager.php`,
                {
                    mode: "listeCommandeLocal",
                    "FILTER_OPTIONS[lg_livcommid]": ID,
                    LG_LIVID: ID,
                    LIMIT: limit,
                    PAGE: page,
                },
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.data.code_statut === "1") {
                setOrders(response.data.data);
                setTotalPage(() => {
                    return Math.ceil(response.data.total / limit);
                });
                setTotal(response.data.total);
            } else {
                toast.error(response.data.desc_statut);
            }
        } catch (error) {
            console.log(error.message);
        }
    };
    if (deliveryCalendar) {
        fetchOrders();
    }

    const { isLoading, isError, data, error, isFetching } = useQuery({
        queryKey: ["todos", limit, page],
        queryFn: () => fetchOrders(limit, page),
        enabled: deliveryCalendar != null,
    });

    useEffect(() => {
        const user = localStorage.getItem("user");

        if (!user) {
            navigate("/sign-in");
        }
    }, [navigate]);

    const pageNumbers = generatePageNumbers(totalPage, page);

    return (
        <div className="row justify-content-center">
            <h1>Calendrier de livraison #{ID}</h1>
            <div className="col-xxl-12">
                <div className="card">
                    <form>
                        <div className="card-body p-4">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label
                                        htmlFor="LG_PROID"
                                        className="form-label"
                                    >
                                        Zone de livraison{" "}
                                    </label>
                                    <p>{deliveryCalendar?.zone}</p>
                                </div>
                                <div className="col-md-6">
                                    <label
                                        htmlFor="LG_PROID"
                                        className="form-label"
                                    >
                                        Description de livraison{" "}
                                    </label>
                                    <p>{deliveryCalendar?.str_livname}</p>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label
                                        htmlFor="DT_CALLIVBEGIN"
                                        className="form-label"
                                    >
                                        Date d'écheance
                                    </label>
                                    <p>
                                        {formatDateOriginal(
                                            deliveryCalendar?.dt_livend
                                        )}{" "}
                                        {/* {(deliveryCalendar?.dt_livend).split[0]} */}
                                    </p>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label
                                        htmlFor="DT_CALLIVEND"
                                        className="form-label"
                                    >
                                        Date de livraison
                                    </label>
                                    <p>
                                        {formatDateOriginal(
                                            deliveryCalendar?.dt_livbegin
                                        )}
                                    </p>
                                </div>

                                <Table
                                    data={orders}
                                    limit={limit}
                                    page={page}
                                    onChangeLimit={handleChangeLimit}
                                    onGoToPage={goToPage}
                                    total={total}
                                    totalPage={totalPage}
                                    pageNumbers={pageNumbers}
                                    isLoading={isLoading}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

const Table = ({
    data,
    limit,
    page,
    onChangeLimit,
    onGoToPage,
    total,
    totalPage,
    pageNumbers,
    isLoading,
}) => {
    return (
        <div className="table-responsive table-card mb-1 p-4">
            <label>Commande sur le calendrier</label>
            <table
                className="table align-middle table-nowrap"
                id="customerTable"
            >
                <thead className="table-light">
                    <tr>
                        <th className="text-uppercase th-text-color">Nom client</th>
                        <th className="text-uppercase th-text-color">Numero commande</th>
                        <th className="text-uppercase th-text-color">Date de commande</th>
                    </tr>
                </thead>
                <tbody className="list form-check-all">
                    {data ? (
                        data.map((item, index) => (
                            <tr key={index}>
                                <td className="customer_name">
                                    {item.str_socname}
                                </td>
                                <td className="phone">{item.lg_commid}</td>
                                <td className="date">
                                    {formatDateOriginal(item?.dt_commupdated)}
                                </td>
                            </tr>
                        ))
                    ) : isLoading ? (
                        <tr>
                            <td colSpan={3}>Chargement des données...</td>
                        </tr>
                    ) : (
                        ""
                    )}
                </tbody>
            </table>
            <div
                className="d-flex justify-content-between mt-3 gap-2"
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
                            Affichage de <b>{limit * page - (limit - 1)}</b> à{" "}
                            <b>{limit * page > total ? total : limit * page}</b>{" "}
                            sur <b>{total}</b> resultats
                        </div>
                        <div className="pagination-wrap hstack gap-2">
                            <button
                                onClick={() => {
                                    onGoToPage(Math.max(1, page - 1));
                                }}
                                className={`page-item pagination-prev ${
                                    page - 1 === 0 ? "disabled" : ""
                                }`}
                                disabled={page - 1 === 0}
                            >
                                Précedent
                            </button>
                            <ul className="pagination listjs-pagination mb-0 d-none d-md-flex">
                                {pageNumbers.map((pageNumber, index) =>
                                    pageNumber === "..." ? (
                                        <span key={index} className="dots">
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
                                            {/* <buttonn class="page" href="#" data-i="1" data-page="8">
                                                                </buttonn> */}
                                            <button
                                                onClick={() =>
                                                    onGoToPage(pageNumber)
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
                                    onGoToPage(Math.min(totalPage, page + 1));
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
    );
};

const PaginatedTable = TableWithPaginationHOC(Table);

export default ConsultationDelivery;
