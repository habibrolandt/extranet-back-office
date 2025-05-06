import { useEffect, useRef, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { crudData, doRequest, mode } from "../services/apiService";
import { useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { formatDateOriginal, generatePageNumbers } from "../services/lib";

const schema = yup.object().shape({
    STR_LSTVALUE: yup.string().required("Ce champ est obligatoire"),
    STR_LSTDESCRIPTION: yup.string().required("Ce champ est obligatoire"),
});

function Zone() {
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
    const [limit, setLimit] = useState(() => {
        return parseInt(searchParams.get("limit")) || 10;
    });
    const [page, setPage] = useState(() => {
        return parseInt(searchParams.get("page")) || 1;
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

    const [currentData, setCurrentData] = useState([]);
    const navigate = useNavigate();
    const [editing, setEditing] = useState({
        zoneId: null,
        zoneValue: null,
        zoneDescription: null,
    });
    const [onDelete, setOnDelete] = useState({
        zoneId: null,
        zoneIndex: null,
    });
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

    const handleCheckboxChange = (index) => {
        setSelectedCheckboxes((prevSelected) => {
            if (prevSelected.includes(index)) {
                return prevSelected.filter((i) => i !== index);
            } else {
                return [...prevSelected, index];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedCheckboxes.length === currentData.length) {
            setSelectedCheckboxes([]);
        } else {
            setSelectedCheckboxes(currentData.map((_, index) => index));
        }
    };

    const handle = (index) => {
        const buttonRef = refs.current[index];
        const zoneId = buttonRef.getAttribute("data-id");
        const zoneValue = buttonRef.getAttribute("data-lst_value");
        const zoneDescription = buttonRef.getAttribute("data-lst_description");
        setEditing({
            zoneId: zoneId,
            zoneValue: zoneValue,
            zoneDescription: zoneDescription,
        });
    };
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const refs = useRef([]);

    const handleSetCurrentData = (value) => {
        if (currentData.length > 0) {
            setCurrentData((prevData) => [...prevData, value]);
        } else {
            setCurrentData((prevData) => [value]);
        }
    };

    const handleEditData = (data) => {
        const updateData = currentData.map((item) => {
            return item.id === data.id
                ? { ...item, name: data.name, description: data.description }
                : item;
        });
        setCurrentData(updateData);
    };

    useEffect(() => {
        const user = localStorage.getItem("user");

        if (!user) {
            navigate("/sign-in");
        }
    }, [navigate]);
    let currentUser = JSON.parse(localStorage.getItem("user"));

    const fetchDemandes = async (activeFilters) => {
        const data = new URLSearchParams();

        for (const key in activeFilters) {
            console.log(key);
            if (key === "search") {
                data.append("FILTER_OPTIONS[search]", activeFilters[key]);
            }
        }

        data.append("mode", mode.getDeliveryPlacesMode);
        data.append("LIMIT", limit);
        data.append("PAGE", page);

        try {
            const response = await crudData(data, "CommandeManager.php");
            setTotal(response.data.total);
            setTotalPage(() => {
                return Math.ceil(response.data.total / limit);
            });

            return response.data.data;
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
        if (data) {
            setCurrentData(data);
        }
    }, [data]);

    const onSubmit = async (data) => {
        data["mode"] = "addDeliveryPlace";
        data["STR_UTITOKEN"] = currentUser.STR_UTITOKEN;
        try {
            const response = await doRequest(data, "CommandeManager.php");
            if (response.data.code_statut === "1") {
                handleSetCurrentData(response.data["zone_de_livraison"][0]);
                setTotalPage(() => {
                    return Math.ceil(response.data.total / limit);
                });
            } else {
                // handleSetShowError();
                console.log("error");
            }
        } catch (error) {
            console.error(error.message);
        }
        reset();
    };

    const deleteZone = async () => {
        const list = [];
        currentData.forEach((item, index) => {
            if (selectedCheckboxes.includes(index)) {
                list.push(item.id);
            }
        });

        const data = {
            mode: "deleteDeliveryPlace",
            LIST_LSTID: list,
            STR_UTITOKEN: currentUser.STR_UTITOKEN,
        };

        try {
            const response = await doRequest(data, "CommandeManager.php");
            if (response.data.code_statut === "1") {
                const newCurrentData = currentData.filter(
                    (item, index) => !selectedCheckboxes.includes(index)
                );
                setCurrentData(newCurrentData);
                setSelectedCheckboxes([]);
                setTotalPage(() => {
                    return Math.ceil(response.data.total / limit);
                });
            } else {
                console.log("error");
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleCurrentRemove = (id, index) => {
        setOnDelete({
            zoneId: id,
            zoneIndex: index,
        });
    };

    const deleteOne = async (id, index) => {
        const data = {
            mode: "deleteDeliveryPlace",
            LG_LSTID: id,
            STR_UTITOKEN: currentUser.STR_UTITOKEN,
        };

        try {
            const response = await doRequest(data, "CommandeManager.php");
            if (response.data.code_statut === "1") {
                const newCurrentData = currentData.filter(
                    (item, index) => item.id !== id
                );
                setCurrentData(newCurrentData);
                // handleCheckboxChange(index);
                setTotalPage(() => {
                    return Math.ceil(response.data.total / limit);
                });
            } else {
                console.log("error");
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    const pageNumbers = generatePageNumbers(totalPage, page);

    return (
        <div className="row justify-content-center">
            <div className="col-xxl-12">
                <h2 className="">Zones de livraisons</h2>
                <div className="card">
                    <div className="card-header">
                        <div className="listjs-table" id="customerList">
                            <div className="row justify-content-between g-4 mb-3">
                                <div className="col-sm-auto">
                                    <div>
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            data-bs-toggle="modal"
                                            data-bs-target="#exampleModalgrid"
                                        >
                                            <i className="ri-add-line align-bottom me-1"></i>{" "}
                                            Ajouter
                                        </button>

                                        <div
                                            className="modal fade"
                                            id="exampleModalgrid"
                                            tabIndex="-1"
                                            aria-labelledby="exampleModalgridLabel"
                                            aria-modal="true"
                                        >
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5
                                                            className="modal-title"
                                                            id="exampleModalgridLabel"
                                                        >
                                                            Ajout de zone de
                                                            livraison
                                                        </h5>
                                                        <button
                                                            type="button"
                                                            className="btn-close"
                                                            data-bs-dismiss="modal"
                                                            aria-label="Close"
                                                        ></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <form
                                                            onSubmit={handleSubmit(
                                                                onSubmit
                                                            )}
                                                        >
                                                            <div className="row g-3">
                                                                <div className="col-xxl-12">
                                                                    <div>
                                                                        <label
                                                                            htmlFor="libéllé"
                                                                            className="form-label"
                                                                        >
                                                                            Libéllé
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            id="libéllé"
                                                                            placeholder="Libéllé zone de livraison"
                                                                            {...register(
                                                                                "STR_LSTVALUE"
                                                                            )}
                                                                        />
                                                                        <p
                                                                            className="text-danger"
                                                                            style={{
                                                                                fontSize:
                                                                                    "12px",
                                                                            }}
                                                                        >
                                                                            {
                                                                                errors
                                                                                    .STR_LSTVALUE
                                                                                    ?.message
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <div className="col-xxl-12">
                                                                    <div>
                                                                        <label
                                                                            htmlFor="description"
                                                                            className="form-label"
                                                                        >
                                                                            Description
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            id="description"
                                                                            placeholder="Description"
                                                                            {...register(
                                                                                "STR_LSTDESCRIPTION"
                                                                            )}
                                                                        />
                                                                        <p
                                                                            className="text-danger"
                                                                            style={{
                                                                                fontSize:
                                                                                    "12px",
                                                                            }}
                                                                        >
                                                                            {
                                                                                errors
                                                                                    .STR_LSTDESCRIPTION
                                                                                    ?.message
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <div className="col-lg-12">
                                                                    <div className="hstack gap-2 justify-content-end">
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-light"
                                                                            data-bs-dismiss="modal"
                                                                        >
                                                                            Annuler
                                                                        </button>
                                                                        <button
                                                                            type="submit"
                                                                            className="btn btn-primary"
                                                                        >
                                                                            Enregsistrer
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <EditModal
                                            editing={editing}
                                            onHandleEditData={handleEditData}
                                            currentUser={currentUser}
                                        />
                                        <DeleteModal
                                            deletedElement={onDelete}
                                            onHandleDeleteOne={deleteOne}
                                            onHandleDeleteAll={deleteZone}
                                        />
                                        {selectedCheckboxes.length > 0 && (
                                            <button
                                                className="btn btn-soft-danger ml-2"
                                                data-bs-toggle="modal"
                                                data-bs-target="#exampleModalgrid3"
                                                onClick={() =>
                                                    handleCurrentRemove(
                                                        null,
                                                        null
                                                    )
                                                }
                                                style={{ marginLeft: "10px" }}
                                            >
                                                <i className="ri-delete-bin-2-line"></i>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="col-sm-auto">
                                    <label className="align-items-center mb-0">
                                        Montrer{" "}
                                        <select
                                            name="alternative-pagination_length"
                                            aria-controls="alternative-pagination"
                                            className="form-select form-select-sm d-inline-block"
                                            style={{ width: 75 }}
                                            onChange={(e) => {
                                                handleSetLimit(e.target.value);
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
                            </div>

                            <div className="table-responsive table-card mt-3 mb-1">
                                <table
                                    className="table align-middle table-nowrap"
                                    id="customerTable"
                                >
                                    <thead className=" bg-light-subtle">
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
                                                        onChange={
                                                            handleSelectAll
                                                        }
                                                        checked={
                                                            selectedCheckboxes.length ===
                                                                currentData?.length &&
                                                            currentData.length >
                                                                0
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
                                                data-sort="email"
                                            >
                                                Date d'ajout
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
                                        {currentData.length > 0 ? (
                                            currentData
                                                .slice(0, limit)
                                                .map((zone, index) => (
                                                    <tr
                                                        key={zone.id}
                                                        title={
                                                            zone?.description
                                                        }
                                                    >
                                                        <th scope="row">
                                                            <div className="form-check">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    name="chk_child"
                                                                    checked={selectedCheckboxes.includes(
                                                                        index
                                                                    )}
                                                                    onChange={() =>
                                                                        handleCheckboxChange(
                                                                            index
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        </th>
                                                        <td className="date text-capitalize">
                                                            {zone.name}
                                                        </td>
                                                        <td className="status">
                                                            {formatDateOriginal(
                                                                zone.created_at
                                                            )}
                                                        </td>
                                                        <td>
                                                            <div className="d-flex gap-2">
                                                                <div className="edit">
                                                                    <button
                                                                        ref={(
                                                                            el
                                                                        ) =>
                                                                            (refs.current[
                                                                                index
                                                                            ] =
                                                                                el)
                                                                        }
                                                                        className="btn btn-sm btn-warning edit-item-btn"
                                                                        data-bs-toggle="modal"
                                                                        data-bs-target="#exampleModalgrid2"
                                                                        data-id={
                                                                            zone.id
                                                                        }
                                                                        data-lst_description={
                                                                            zone.description
                                                                        }
                                                                        data-lst_value={
                                                                            zone.name
                                                                        }
                                                                        onClick={() =>
                                                                            handle(
                                                                                index
                                                                            )
                                                                        }
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
                                                                    </button>
                                                                </div>
                                                                <div className="remove">
                                                                    <button
                                                                        onClick={() =>
                                                                            handleCurrentRemove(
                                                                                zone.id,
                                                                                index
                                                                            )
                                                                        }
                                                                        className="btn btn-sm btn-danger remove-item-btn"
                                                                        data-bs-toggle="modal"
                                                                        data-bs-target="#exampleModalgrid3"
                                                                    >
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            viewBox="0 0 24 24"
                                                                            fill="currentColor"
                                                                            style={{
                                                                                width: "20px",
                                                                            }}
                                                                        >
                                                                            <path d="M7 4V2H17V4H22V6H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V6H2V4H7ZM6 6V20H18V6H6ZM9 9H11V17H9V9ZM13 9H15V17H13V9Z"></path>
                                                                        </svg>
                                                                    </button>
                                                                </div>
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
                                className="d-flex justify-content-between mt-3 gap-2"
                                style={{ flexWrap: "wrap" }}
                            >
                                {currentData && (
                                    <>
                                        {/* <div className="d-flex gap-4 align-items-center"> */}
                                        <div
                                            role="status"
                                            aria-live="polite"
                                            className="gridjs-summary"
                                            title="Page 2 of 2"
                                        >
                                            Affichage de{" "}
                                            <b>{limit * page - (limit - 1)}</b>{" "}
                                            à <b>{limit * page}</b> sur{" "}
                                            <b>{total}</b> resultats
                                        </div>
                                        {/* </div> */}
                                        <div className="pagination-wrap hstack gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    goToPage(
                                                        Math.max(1, page - 1)
                                                    )
                                                }
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
        </div>
    );
}

const editSchema = yup.object().shape({
    STR_LSTDESCRIPTION: yup.string().required("Ce champ est obligatoire"),
});

function EditModal({ editing, currentUser, onHandleEditData }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(editSchema),
    });

    const onSubmit = async (data) => {
        data["mode"] = "updateDeliveryPlace";
        data["STR_UTITOKEN"] = currentUser.str_utitoken;
        data["LG_LSTID"] = editing.zoneId;
        try {
            const response = await doRequest(data, "CommandeManager.php");
            if (response.data.code_statut === "1") {
                onHandleEditData({
                    name: data.STR_LSTVALUE,
                    description: data.STR_LSTDESCRIPTION,
                    id: editing.zoneId,
                });
                reset({
                    STR_LSTDESCRIPTION: data.STR_LSTDESCRIPTION,
                    STR_LSTVALUE: data.STR_LSTVALUE,
                });
            } else {
                // handleSetShowError();
                console.log("error");
            }
        } catch (error) {
            console.error(error.message);
        }
        reset();
    };

    return (
        <div
            className="modal fade"
            id="exampleModalgrid2"
            tabIndex="-1"
            aria-labelledby="exampleModalgridLabel2"
            aria-modal="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalgridLabel2">
                            Modification
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="row g-3">
                                <div className="col-xxl-12">
                                    <div>
                                        <label
                                            htmlFor="firstName"
                                            className="form-label"
                                        >
                                            Libéllé zone de livraison
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="firstName"
                                            placeholder="Zone de livraison"
                                            {...register("STR_LSTVALUE")}
                                            defaultValue={editing.zoneValue}
                                        />
                                        <p
                                            className="text-danger"
                                            style={{
                                                fontSize: "12px",
                                            }}
                                        >
                                            {errors.STR_LSTVALUE?.message}
                                        </p>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="firstName"
                                            className="form-label"
                                        >
                                            Description
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="firstName"
                                            placeholder="Zone de livraison"
                                            {...register("STR_LSTDESCRIPTION")}
                                            defaultValue={
                                                editing.zoneDescription
                                            }
                                        />
                                        <p
                                            className="text-danger"
                                            style={{
                                                fontSize: "12px",
                                            }}
                                        >
                                            {errors.STR_LSTDESCRIPTION?.message}
                                        </p>
                                    </div>
                                </div>

                                <div className="col-lg-12">
                                    <div className="hstack gap-2 justify-content-end">
                                        <button
                                            type="button"
                                            className="btn btn-light"
                                            data-bs-dismiss="modal"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                        >
                                            Enregsistrer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
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
                                        onClick={
                                            deletedElement.zoneId !== null
                                                ? () =>
                                                      onHandleDeleteOne(
                                                          deletedElement.zoneId,
                                                          deletedElement.zoneIndex
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

export default Zone;
