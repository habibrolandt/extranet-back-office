import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { doRequest, rootUrl } from "../services/apiService";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import DataTableCmd from "../Mescomposants/DataTableCmd/DataTableCmd";
import axiosInstance from "../axiosInstance";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

// export async function editLivCalLoader({ params }) {
//     let deliveryPlaces = null;
//     let data3 = null;

//     const formData2 = new FormData();
//     formData2.append("mode", "getDeliveryPlace");
//     formData2.append("LIMIT", 10);
//     formData2.append("PAGE", 1);

//     const formData3 = new FormData();
//     formData3.append("mode", "listDeliveryCalendar");
//     formData3.append("LIMIT", 10);
//     formData3.append("PAGE", 1);
//     formData3.append("LG_LIVID", params.ID);

//     try {
//         const [response2, response3] = await Promise.all([
//             axios.post(`${rootUrl}CommandeManager.php`, formData2),
//             axios.post(`${rootUrl}CommandeManager.php`, formData3),
//         ]);
//         // data = response1.data["data"];
//         deliveryPlaces = response2.data["zone_de_livraison"];
//         data3 = response3.data["data"];
//     } catch (error) {
//         console.error(error);
//     }

//     return { deliveryPlaces, data3 };
// }

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
function EditLivCalendar() {
    // const { deliveryPlaces, data3 } = useLoaderData();
    const { ID } = useParams();
    const [deliveryCalendar, setDeliveryCalendar] = useState(null);
    const [deliveryPlaces, setDeliveryPlaces] = useState(null);
    const [orders, setOrders] = useState([]);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(null);
    const [total, setTotal] = useState(null);
    const navigate = useNavigate();
    const [show, setShow] = useState({
        showError: false,
        showSuccess: false,
    });
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

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
    }, []);

    useEffect(() => {
        const fetchDeliveryPlace = async () => {
            try {
                const response = await axiosInstance.post(
                    `CommandeManager.php`,
                    {
                        mode: "getDeliveryPlace",
                        LIMIT: 9999,
                        PAGE: 1,
                    },
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                setDeliveryPlaces(response.data.data);
            } catch (error) {
                toast.log(error.message);
            }
        };

        fetchDeliveryPlace();
    }, []);

    const fetchOrders = async (limit, page) => {
        try {
            const response = await axiosInstance.post(
                `CommandeManager.php`,
                {
                    mode: "listeCommandeLocal",
                    // ORDER_NOT_ON_LIVRAISON: true,
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

    const { isLoading, isError, data, error, isFetching } = useQuery({
        queryKey: ["todos", limit, page],
        queryFn: () => fetchOrders(limit, page),
        enabled: deliveryCalendar != null,
    });

    const handleSelectedCheckbox = (index) => {
        setSelectedCheckboxes((prevSelected) => {
            if (prevSelected.includes(index)) {
                return prevSelected.filter((i) => i !== index);
            } else {
                return [...prevSelected, index];
            }
        });
    };

    const handleSelectedAll = () => {
        if (selectedCheckboxes.length === orders.length) {
            setSelectedCheckboxes([]);
        } else {
            setSelectedCheckboxes(orders.map((_, index) => index));
        }
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            LG_LSTID: "", // Valeur par défaut initiale vide
            STR_LIVNAME: "",
            DT_LIVBEGIN: "",
            DT_LIVEND: "",
        },
    });

    useEffect(() => {
        if (deliveryCalendar) {
            reset({
                LG_LSTID: deliveryCalendar.zone_id || "",
                STR_LIVNAME: deliveryCalendar.str_livname || "",
                DT_LIVBEGIN: deliveryCalendar.dt_livbegin || "",
                DT_LIVEND: deliveryCalendar.dt_livend || "",
            });
        }
    }, [deliveryCalendar, reset]);

    useEffect(() => {
        const user = localStorage.getItem("user");

        if (!user) {
            navigate("/sign-in");
        }
    }, [navigate]);

    useEffect(() => {
        if (deliveryCalendar?.commandes != null && orders?.length > 0) {
            const initialSelectedCheckboxes = deliveryCalendar.commandes
                .split(", ")
                .map((item) => orders.findIndex((el) => el.lg_commid === item));

            setSelectedCheckboxes(initialSelectedCheckboxes);
        }
    }, [deliveryCalendar, orders]);
    let currentUser = JSON.parse(localStorage.getItem("user"));

    const onSubmit = async (params) => {
        try {
            const selectedData = selectedCheckboxes.map(
                (index) => orders[index].lg_commid
            );

            params["mode"] = "updateDeliveryCalendar";
            params["STR_UTITOKEN"] = currentUser.STR_UTITOKEN;

            params["DT_LIVBEGIN"] = format(
                new Date(params["DT_LIVBEGIN"]),
                "yyyy-MM-dd'T'HH:mm:ss"
            );
            params["DT_LIVEND"] = format(
                new Date(params["DT_LIVEND"]),
                "yyyy-MM-dd'T'HH:mm:ss"
            );
            if (selectedData.length > 0) {
                params["CMD_LIST"] = selectedData;
            }
            params["LG_LIVID"] = deliveryCalendar.lg_livid;
            delete params.DT_CALLIVBEGIN;
            delete params.DT_CALLIVEND;
            const response = await doRequest(params, "CommandeManager.php");
            if (response.data.code_statut === "1") {
                handleSetShowSuccess();
                navigate("/calendriers-livraisons");
            } else {
                console.error(response.data);
                handleSetShowError();
            }
            console.log(params);
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

    return (
        <div className="row justify-content-center">
            <div className="col-xxl-12">
                <h2>Calendrier de livraison #{ID}</h2>
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
                                        Description{" "}
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
                                        {deliveryPlaces &&
                                            deliveryPlaces.map(
                                                (item, index) => (
                                                    <option
                                                        key={index}
                                                        value={item.id}
                                                        selected={
                                                            item.id ===
                                                            deliveryCalendar?.zone_id
                                                        }
                                                    >
                                                        {item.name}
                                                    </option>
                                                )
                                            )}
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

                            <DataTableCmd
                                commandeList={orders}
                                selectedCheckboxes={selectedCheckboxes}
                                onSelectedAll={handleSelectedAll}
                                onSelectedCheckbox={handleSelectedCheckbox}
                                deliveryCalendarList={deliveryCalendar}
                                option={"edit"}
                                onChangeLimit={handleChangeLimit}
                                onGoToPage={goToPage}
                                limit={limit}
                                page={page}
                                totalPage={totalPage}
                                total={total}
                            />

                            {/*end row*/}
                            <div className="hstack gap-2 justify-content-end d-print-none mt-4">
                                <Link
                                    type="reset"
                                    to="/calendriers-livraisons"
                                    className="btn btn-light"
                                >
                                    Annuler
                                </Link>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
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

export default EditLivCalendar;
