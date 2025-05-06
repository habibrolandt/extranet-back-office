import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { ProfilCreationSchema } from "../services/formSchema";
import { useEffect, useState } from "react";
import { crudData } from "../services/apiService";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { generatePageNumbers } from "../services/lib";
import AsyncSelect from "react-select/async";
import { fetchTypeProfil } from "../api/Liste";
import {
    createProfil,
    fetchProfil,
    fetchProfilPrivileges,
    updateProfil,
} from "../api/Profil";

function CreateOrEditProfil() {
    const [checkedOptions, setCheckedOptions] = useState([]);
    const [editingProfil, setEditingProfil] = useState(null);
    const { ID } = useParams();
    const navigate = useNavigate();
    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(ProfilCreationSchema),
        defaultValues: {
            STR_PRODESCRIPTION: "",
            STR_PRONAME: "",
        },
    });

    const onSubmit = (data) => {
        if (ID) {
            data = { ...data, LG_PROID: ID };
            let result = updateProfil(data, checkedOptions);
            if (result) {
                reset({
                    STR_PRODESCRIPTION: data.STR_PRODESCRIPTION,
                    STR_PRONAME: data.STR_PRONAME,
                    LG_LSTID: {
                        label: data.LG_LSTID.label,
                        value: data.LG_LSTID.value,
                    },
                });
                const editedProfil = {
                    PRODESCRIPTION: data.STR_PRODESCRIPTION,
                    PRONAME: data.STR_PRONAME,
                    PROTYPEID: data.LG_LSTID.value,
                    PROTYPE: data.LG_LSTID.label,
                };
                setEditingProfil(editedProfil);
            }
        } else {
            let result = createProfil(data, checkedOptions);
            if (result) {
                navigate(-1);
            }
        }
    };

    const handleCheck = (ID) => {
        let newChecked = [];
        if (checkedOptions.includes(ID)) {
            newChecked = checkedOptions.filter((item) => item !== ID);
        } else {
            newChecked = [...checkedOptions, ID];
        }
        setCheckedOptions(newChecked);
    };

    const handleCheckAll = (data, everythingIsChecked = false) => {
        if (everythingIsChecked) {
            const t = data.map((item) => item.PRIID);
            let newChecked = checkedOptions.filter(
                (option) => !t.includes(option)
            );
            setCheckedOptions(newChecked);
        } else {
            let newChecked = data
                .filter((item) => !checkedOptions.includes(item.PRIID))
                .map((item) => item.PRIID);

            const mergeList = [...newChecked, ...checkedOptions];
            setCheckedOptions(mergeList);
        }
    };

    useEffect(() => {
        if (ID) {
            const currentProfil = fetchProfil(ID);
            currentProfil.then((data) => {
                setEditingProfil(data);
                reset({
                    STR_PRODESCRIPTION: data.PRODESCRIPTION,
                    STR_PRONAME: data.PRONAME,
                    LG_LSTID: {
                        label: data.PROTYPE,
                        value: data.PROTYPEID,
                    },
                });
            });
        }
    }, [ID, reset]);

    useEffect(() => {
        if (editingProfil) {
            const privileges = fetchProfilPrivileges(ID);
            privileges.then((data) => {
                setCheckedOptions(data.map((privilege) => privilege.PRIID));
            });
        }
    }, [editingProfil, ID]);

    return (
        <div className="row  justify-content-center">
            <h2>
                Création d'un profil{" "}
                <span
                    className="h5"
                    title="Pour accorder des privilèges, cocher la case concernée."
                >
                    <i className="ri-error-warning-line"></i>
                </span>
            </h2>
            <div className="col-lg-5">
                <div className="card">
                    <div className="card-header p-3">
                        <h5 className="m-0">Données du profil</h5>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="card-body p-4">
                            <div className="row g-3">
                                <div className="col-sm-12">
                                    <label
                                        htmlFor="STR_PRONAME"
                                        className="form-label"
                                    >
                                        Code
                                        <span className="text-danger h4 align-middle">
                                            *
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="STR_PRONAME"
                                        placeholder="Code"
                                        {...register("STR_PRONAME")}
                                    />
                                    {errors.STR_PRONAME && (
                                        <div
                                            className="invalid-feedback"
                                            style={{ display: "block" }}
                                        >
                                            {errors.STR_PRONAME?.message}
                                        </div>
                                    )}
                                </div>

                                <div className="col-md-12">
                                    <label
                                        htmlFor="STR_PRODESCRIPTION"
                                        className="form-label"
                                    >
                                        Description{" "}
                                        <span className="text-danger h4 align-middle">
                                            *
                                        </span>{" "}
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="STR_PRODESCRIPTION"
                                        placeholder="Description"
                                        {...register("STR_PRODESCRIPTION")}
                                    />
                                    {errors.STR_PRODESCRIPTION && (
                                        <div
                                            className="invalid-feedback"
                                            style={{ display: "block" }}
                                        >
                                            {errors.STR_PRODESCRIPTION?.message}
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-12 form-group">
                                    <label
                                        htmlFor="STR_PROTYPE"
                                        className="form-label"
                                    >
                                        Type{" "}
                                        <span className="text-danger h4 align-middle">
                                            *{" "}
                                        </span>{" "}
                                    </label>
                                    <Controller
                                        name="LG_LSTID"
                                        control={control}
                                        defaultValue={null}
                                        render={({ field }) => (
                                            <AsyncSelect
                                                {...field}
                                                cacheOptions
                                                defaultOptions
                                                loadOptions={fetchTypeProfil}
                                                onChange={(selectedOption) =>
                                                    field.onChange(
                                                        selectedOption
                                                    )
                                                }
                                                value={field.value}
                                            />
                                        )}
                                    />

                                    {errors.LG_LSTID && (
                                        <div
                                            className="invalid-feedback"
                                            style={{ display: "block" }}
                                        >
                                            {errors.LG_LSTID?.message}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="hstack gap-2 justify-content-end d-print-none mt-4">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => {
                                        if (ID) {
                                            reset({
                                                STR_PRODESCRIPTION:
                                                    editingProfil.PRODESCRIPTION,
                                                STR_PRONAME:
                                                    editingProfil.PRONAME,
                                                LG_LSTID: {
                                                    label: editingProfil.PROTYPE,
                                                    value: editingProfil.PROTYPEID,
                                                },
                                            });
                                        } else {
                                            reset();
                                        }
                                    }}
                                >
                                    <i className="ri-refresh-line align-bottom me-1"></i>
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-success"
                                >
                                    <i className="ri-send-plane-fill align-bottom me-1" />{" "}
                                    {ID ? "Modifier" : "Ajouter"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div className="col-lg-7">
                <PrivilegeCard
                    onCheck={handleCheck}
                    onCheckAll={handleCheckAll}
                    checkedOptions={checkedOptions}
                />
            </div>
        </div>
    );
}

const PrivilegeCard = ({ onCheck, onCheckAll, checkedOptions }) => {
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

    const fetchProducts = async (activeFilters) => {
        const data = new URLSearchParams();

        for (const key in activeFilters) {
            if (key === "search") {
                data.append("FILTER_OPTIONS[search]", activeFilters[key]);
            }
        }

        data.append("LIMIT", limit);
        data.append("PAGE", page);
        data.append("mode", "listPrivilege");

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

    useEffect(() => {
        const user = localStorage.getItem("user");

        if (!user) {
            navigate("/");
        }
    }, [navigate]);

    const pageNumbers = generatePageNumbers(totalPage, page);
    return (
        <div className="card" id="invoiceList">
            <div className="card-header p-3">
                <h5 className="m-0">Liste privilèges</h5>
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
                                    <option value="10" selected={limit === 10}>
                                        10
                                    </option>
                                    <option value="25" selected={limit === 25}>
                                        25
                                    </option>
                                    <option value="50" selected={limit === 50}>
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
                <div className="d-flex flex-column" style={{ minHeight: 600 }}>
                    <div className="table-responsive table-card mb-3">
                        {data && data.length > 0 ? (
                            <table
                                className="table align-middle table-nowrap"
                                id="invoiceTable"
                            >
                                <thead className="text-light bg-primary">
                                    <tr>
                                        <th className="text-uppercase th-text-color">
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    checked={
                                                        checkedOptions.length ===
                                                        total
                                                    }
                                                    onChange={() => {
                                                        if (
                                                            checkedOptions.length ===
                                                            total
                                                        ) {
                                                            onCheckAll(
                                                                data,
                                                                true
                                                            );
                                                        } else {
                                                            onCheckAll(data);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </th>
                                        <th className="text-uppercase th-text-color">
                                            Description
                                        </th>
                                    </tr>
                                </thead>
                                <tbody
                                    className="list form-check-all"
                                    id="invoice-list-data"
                                >
                                    {data && data.length > 0
                                        ? data.map((privilege, index) => (
                                              <tr key={index}>
                                                  <td>
                                                      <div className="form-check">
                                                          <input
                                                              type="checkbox"
                                                              className="form-check-input"
                                                              checked={checkedOptions.includes(
                                                                  privilege.PRIID
                                                              )}
                                                              onChange={() => {
                                                                  onCheck(
                                                                      privilege.PRIID
                                                                  );
                                                              }}
                                                          />
                                                      </div>
                                                  </td>
                                                  <td>{privilege.PRINAME}</td>
                                              </tr>
                                          ))
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
                                    <span className="visually-hidden">
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
                                        {limit * page > total
                                            ? total
                                            : limit * page}{" "}
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
                                    <ul className="pagination listjs-pagination mb-0">
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
                                                Math.min(totalPage, page + 1)
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
    );
};
export default CreateOrEditProfil;
