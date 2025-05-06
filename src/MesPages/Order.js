import React, { useEffect, useState } from "react";
import useOrderState from "../store/orderState";
import {
    formatDateOriginal,
    formatPrice,
    verifyImageLink,
} from "../services/lib";
import { useParams } from "react-router-dom";
import { crudData, fullUrl } from "../services/apiService";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import Select from "react-select";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

function Order() {
    const { orderID } = useParams();
    const {
        state,
        fetchOrderDetails,
        fetchOrderProducts,
        updateProductQuantity,
        deleteProductOnOrder,
        addProductToOrder,
    } = useOrderState();
    const { loading, error, order, orderProducts, canFetchOrderProducts } =
        state;
    const [products, setProducts] = useState([]);
    const [selectOptions, setSelectOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [listDeliveryPlace, setListDeliveryPlace] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [
        canFetchListOfSubstitutionProducts,
        setCanFetchListOfSubstitutionProducts,
    ] = useState(false);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    useEffect(() => {
        fetchOrderDetails(orderID);
    }, [fetchOrderDetails, orderID]);

    useEffect(() => {
        if (order && canFetchOrderProducts) {
            fetchOrderProducts(orderID);
            if (error === null) {
                setCanFetchListOfSubstitutionProducts(true);
            }
        }
    }, [order, fetchOrderProducts, orderID, canFetchOrderProducts, error]);

    useEffect(() => {
        if (orderProducts && canFetchListOfSubstitutionProducts) {
            const fetchListOfSubstitutionProducts = async () => {
                const payload = new FormData();

                payload.append("mode", "listProduct");
                payload.append("LIMIT", 900);
                payload.append("PAGE", 1);

                try {
                    const response = await crudData(
                        payload,
                        "StockManager.php"
                    );
                    // if (response.data.code_statut === "1") {
                    setProducts(response.data.products);
                    // }
                    setCanFetchListOfSubstitutionProducts(false);
                } catch (error) {
                    console.log("error", error.message);
                    toast.error(
                        "Impossible d'obtenir la liste des produits. Veuillez reessayez plus tard"
                    );
                }
            };

            fetchListOfSubstitutionProducts();
        }
    }, [orderProducts, canFetchListOfSubstitutionProducts]);

    useEffect(() => {
        if (products && products.length > 0) {
            const fetchDeliveryPlace = async () => {
                const payload = new FormData();

                payload.append("mode", "getDeliveryPlace");
                payload.append("LIMIT", 9000);
                payload.append("PAGE", 1);

                try {
                    const response = await crudData(
                        payload,
                        "CommandeManager.php"
                    );
                    if (response.data.code_statut === "1") {
                        setListDeliveryPlace(response.data.data);
                    } else {
                        toast.error(response.data.desc_statut);
                    }
                } catch (error) {
                    console.log("error", error.message);
                    toast.error(
                        "Impossible d'obtenir les zones de livraison. Veuillez reessayez plus tard"
                    );
                }
            };

            fetchDeliveryPlace();
        }
    }, [products]);

    const handleProductSelectChange = (selected) => {
        setSelectedOptions(selected);
    };

    useEffect(() => {
        if (products != null && orderProducts) {
            const affiliatedProductIds = orderProducts.map(
                (product) => product.ArtID
            );

            const filteredProducts = products.filter((product) => {
                if (affiliatedProductIds.includes(product.ArtID)) {
                    return false;
                }
                if (product.ArtStk === 0) {
                    return false;
                }

                return true;
            });

            const opt = filteredProducts.map((product) => {
                return {
                    value: product.ArtID,
                    label: product.ArtLib,
                };
            });

            setSelectOptions(opt);
        }
    }, [orderProducts, products]);

    const handleAddProductToOrder = () => {
        const cmdData = selectedOptions.map((product) => {
            return {
                int_cprquantity: 1,
                str_proname: product.label,
                lg_proid: product.value,
            };
        });

        setIsLoading(true);
        addProductToOrder(order.lg_ageid, cmdData, orderID);
        setIsLoading(false);
        if (error == null) {
            setSelectedOptions([]);
            toast.success("Produits ajoutés avec succès", {
                position: "top-right",
            });
        }
    };
    return (
        <>
            <div className="row justify-content-center">
                <h1 className="mb-4">Commande #{orderID}</h1>
                <div className="col-xxl-3">
                    <div className="card" style={{ minHeight: 484.2 }}>
                        <form>
                            <div className="row"></div>
                            <div
                                className="card-body p-3"
                                // style={{ minHeight: 608 }}
                            >
                                <h5 className="mb-4">Information du client</h5>
                                <div className="col-md-6">
                                    <label
                                        htmlFor="art_gamme"
                                        className="form-label"
                                    >
                                        Nom client{" "}
                                    </label>
                                    <p>{order && order?.str_socname}</p>
                                </div>
                                <div className="col-md-6">
                                    <label
                                        htmlFor="art_gamme"
                                        className="form-label"
                                    >
                                        Type entreprise{" "}
                                    </label>
                                    <p>{order && order?.type_societe}</p>
                                </div>
                                <div className="col-md-6">
                                    <label
                                        htmlFor="art_gamme"
                                        className="form-label"
                                    >
                                        Adresse email{" "}
                                    </label>
                                    <p>{order && order?.str_socmail}</p>
                                </div>
                                <div className="col-md-6">
                                    <label
                                        htmlFor="art_gamme"
                                        className="form-label"
                                    >
                                        Contact{" "}
                                    </label>
                                    <p>{order && order?.str_socphone}</p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="col-xxl-4">
                    <div className="card" style={{ minHeight: 484.2 }}>
                        <form>
                            <div className="row"></div>
                            <div
                                className="card-body p-3"
                                // style={{ minHeight: 608 }}
                            >
                                <h5 className="mb-4">Details de la commande</h5>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label
                                            htmlFor="art_categorie"
                                            className="form-label"
                                        >
                                            N° Commande{" "}
                                        </label>
                                        {/* <input
                                            type="text"
                                            className="form-control"
                                            id="art_categorie"
                                            defaultValue=
                                            disabled
                                        /> */}
                                        <p>{order?.lg_commid}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <label
                                            htmlFor="art_gamme"
                                            className="form-label"
                                        >
                                            Date de commande{" "}
                                        </label>
                                        <p>
                                            {order &&
                                                formatDateOriginal(
                                                    order?.dt_commupdated
                                                )}
                                        </p>
                                    </div>
                                    <div className="col-md-3">
                                        <label
                                            htmlFor="int_propricevente"
                                            className="form-label"
                                        >
                                            Montant HT{" "}
                                        </label>
                                        <p>
                                            {order &&
                                                formatPrice(
                                                    order?.dbl_commmtht
                                                ) + " FCFA"}
                                        </p>
                                    </div>
                                    <div className="col-md-3">
                                        <label
                                            htmlFor="int_propriceachat"
                                            className="form-label"
                                        >
                                            Montant TTC{" "}
                                        </label>
                                        <p>
                                            {order &&
                                                formatPrice(
                                                    order?.dbl_commmtttc
                                                ) + " FCFA"}
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <label
                                            htmlFor="str_commstatut"
                                            className="form-label"
                                        >
                                            Statut de la commande{" "}
                                        </label>
                                        <h5>
                                            <span
                                                className={`badge text-uppercase ${
                                                    order?.str_commstatut ===
                                                    "waiting"
                                                        ? "bg-warning-subtle text-warning"
                                                        : "bg-success-subtle text-success"
                                                }`}
                                            >
                                                {order?.str_commstatut ===
                                                "waiting"
                                                    ? "En attente"
                                                    : "Cloturé"}
                                            </span>
                                        </h5>
                                    </div>
                                    {order?.str_commstatut === "waiting" && (
                                        <div className="col-md-12 p-2">
                                            <label
                                                className=""
                                                htmlFor="substitution-products"
                                            >
                                                Ajouter produits à la commande :
                                            </label>
                                            {selectOptions && (
                                                <Select
                                                    isMulti
                                                    name="colors"
                                                    options={selectOptions}
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"
                                                    onChange={
                                                        handleProductSelectChange
                                                    }
                                                    value={selectedOptions}
                                                    placeholder="Choisir produits"
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                                {order?.str_commstatut === "waiting" && (
                                    <div className="hstack gap-2 justify-content-end d-print-none mt-2">
                                        <button
                                            type="button"
                                            className="btn btn-success"
                                            onClick={handleAddProductToOrder}
                                            disabled={
                                                selectedOptions.length === 0
                                            }
                                        >
                                            <i className="ri-send-plane-fill align-bottom me-1" />{" "}
                                            Ajouter
                                            {isLoading && (
                                                <div
                                                    className="spinner-border spinner-border-sm align-middle ms-2"
                                                    role="status"
                                                >
                                                    <span className="sr-only">
                                                        Loading...
                                                    </span>
                                                </div>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
                <OrderDetails
                    orderProducts={orderProducts}
                    onUpdateProductQuantity={updateProductQuantity}
                    onDeleteProductOnOrder={deleteProductOnOrder}
                    showEditOptions={order?.str_commstatut === "waiting"}
                />
                {order?.str_commstatut === "waiting" && (
                    <ValidationComponent
                        listDeliveryPlace={listDeliveryPlace}
                    />
                )}
            </div>
        </>
    );
}

const OrderDetails = ({
    orderProducts,
    onUpdateProductQuantity,
    onDeleteProductOnOrder,
    showEditOptions,
}) => {
    const { state } = useOrderState();
    const { error } = state;

    const handleDeleteProductOnOrder = (LG_CPRID) => {
        onDeleteProductOnOrder(LG_CPRID);
        if (error == null) {
            toast.success("Produit supprimé avec succès", {
                position: "top-right",
            });
        }
    };

    return (
        <div className="col-xl-5">
            <div className="card" style={{ minHeight: 484.2 }}>
                <div className="card-header">
                    <div className="d-flex align-items-center">
                        <h5 className="card-title flex-grow-1 mb-0">
                            Produits sur la commande
                        </h5>
                    </div>
                </div>
                <div className="card-body">
                    {/* <div style={{ maxHeight: "500px", overflowY: "auto" }}> */}
                    <div className="table-responsive table-card">
                        <table className="table table-nowrap align-middle table-borderless mb-0">
                            <thead className="text-white bg-light-subtle">
                                <tr>
                                    <th scope="col">Details du produit</th>
                                    <th scope="col">Total</th>
                                    <th scope="col">Quantité</th>
                                    {showEditOptions && <th className="text-white text-uppercase"></th>}
                                </tr>
                            </thead>
                            <tbody>
                                {orderProducts &&
                                    orderProducts.map((product, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className="d-flex">
                                                    <div className="flex-shrink-0 avatar-md bg-light rounded border border-solid p-1">
                                                        <img
                                                            src={
                                                                product &&
                                                                product.ArtGPicID
                                                                    ? verifyImageLink(
                                                                          fullUrl +
                                                                              product.ArtGPicID
                                                                      ) !==
                                                                      false
                                                                        ? fullUrl +
                                                                          product.ArtGPicID
                                                                        : `${fullUrl}/extranetbackend/backoffice/images/default-product-image.jpg`
                                                                    : fullUrl +
                                                                      "/extranetbackend/backoffice/images/default-product-image.jpg"
                                                            }
                                                            alt=""
                                                            className="img-fluid d-block"
                                                        />
                                                    </div>
                                                    <div className="flex-grow-1 ms-3">
                                                        <h5 className="fs-15">
                                                            <NavLink
                                                                to={`/dashboard/produit/${product.ArtID}`}
                                                                className="link-primary"
                                                            >
                                                                {
                                                                    product?.ArtLib
                                                                }
                                                            </NavLink>
                                                        </h5>
                                                        <p className="text-muted mb-0">
                                                            {
                                                                product?.ArtPrixBase
                                                            }{" "}
                                                            <span className="fw-medium">
                                                                *{" "}
                                                                {
                                                                    product?.int_cprquantity
                                                                }
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                {product &&
                                                    formatPrice(
                                                        product?.ArtPrixBase *
                                                            product.int_cprquantity
                                                    ) + " FCFA"}
                                            </td>
                                            <td>
                                                <ButtonQuantity
                                                    quantity={
                                                        product?.int_cprquantity
                                                    }
                                                    onUpdateProductQuantity={
                                                        onUpdateProductQuantity
                                                    }
                                                    LG_CPRID={product?.LG_CPRID}
                                                    showEditOptions={
                                                        showEditOptions
                                                    }
                                                />
                                            </td>
                                            {showEditOptions && (
                                                <td>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteProductOnOrder(
                                                                product?.LG_CPRID
                                                            )
                                                        }
                                                        className="btn btn-danger"
                                                    >
                                                        <i className="ri-delete-bin-line"></i>
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                    {/* </div> */}
                </div>
            </div>
        </div>
    );
};

const ButtonQuantity = ({
    quantity,
    onUpdateProductQuantity,
    LG_CPRID,
    showEditOptions,
}) => {
    const [productQuantity, setProductQuantity] = useState(quantity);
    const [isLoading, setIsLoading] = useState(false);
    const { state } = useOrderState();
    const { error } = state;
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (productQuantity !== quantity) {
            setShow(true);
        } else {
            setShow(false);
        }
    }, [productQuantity, quantity]);

    const handleIncrement = () => {
        setProductQuantity((prev) => prev + 1);
    };

    const handleDecrement = () => {
        if (productQuantity - 1 > 0) {
            setProductQuantity((prev) => prev - 1);
        }
    };

    const handleUpdateProductQuantity = () => {
        setIsLoading(true);
        onUpdateProductQuantity(productQuantity, LG_CPRID);
        setIsLoading(false);

        if (error == null) {
            // setProductQuantity(quantity);
            toast.success("Quantité mise à jour avec succès", {
                position: "top-right",
            });
        }
    };

    return (
        <>
            <div
                className={`d-flex  ${
                    showEditOptions ? "justify-content-center" : ""
                } align-items-center`}
            >
                {showEditOptions && (
                    <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={handleDecrement}
                        disabled={quantity <= 0}
                    >
                        -
                    </button>
                )}
                <input
                    type="text"
                    className="form-control text-center mx-2"
                    style={{
                        width: "60px",
                    }}
                    value={productQuantity}
                    disabled
                />
                {showEditOptions && (
                    <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={handleIncrement}
                    >
                        +
                    </button>
                )}
            </div>
            {show && (
                <div className="d-flex align-items-center justify-content-center mt-2">
                    <button
                        className="btn btn-sm btn-success d-flex align-items-center gap-2"
                        onClick={handleUpdateProductQuantity}
                    >
                        Valider
                        {isLoading && (
                            <div
                                className="spinner-border spinner-border-sm"
                                role="status"
                            >
                                <span className="sr-only">Loading...</span>
                            </div>
                        )}
                    </button>
                </div>
            )}
        </>
    );
};

const schema = yup.object().shape({
    LG_LSTID: yup.string().required("La zone de livraison est requise"),
    STR_LIVADRESSE: yup.string().required("L'adresse de livraison est requise"),
});

const ValidationComponent = ({ listDeliveryPlace }) => {
    const { state, orderValidation } = useOrderState();
    const { order, error } = state;
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            LG_LSTID: order?.lg_livid || "",
            STR_LIVADRESSE: order?.str_livadresse || "", // Valeur par défaut pour le champ select
        },
    });

    const onSubmit = (data) => {
        setIsLoading(true);
        orderValidation(order?.lg_commid, data.STR_LIVADRESSE, data.LG_LSTID);
        setIsLoading(false);
        if (!error) {
            toast.success("Commande validée avec succès");
        }
    };

    return (
        <div className="col-xxl-12">
            <div className="card">
                <div className="card-body p-3" style={{ minHeight: 60 }}>
                    <h5 className="mb-2">Validation commande</h5>
                    <form className="" onSubmit={handleSubmit(onSubmit)}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label
                                    htmlFor="art_categorie"
                                    className="form-label"
                                >
                                    Zone de livraison{" "}
                                </label>
                                <select
                                    {...register("LG_LSTID")}
                                    className={`form-control ${
                                        errors.LG_LSTID ? "is-invalid" : ""
                                    }`}
                                    id="LG_LSTID"
                                    defaultValue={order?.lg_livid}
                                >
                                    <option value="">
                                        Sélectionnez une zone
                                    </option>
                                    {listDeliveryPlace &&
                                        listDeliveryPlace.map(
                                            (place, index) => (
                                                <option
                                                    key={index}
                                                    value={place.id}
                                                    selected={
                                                        order?.lg_livid ===
                                                        place.id
                                                    }
                                                >
                                                    {place.name}
                                                </option>
                                            )
                                        )}
                                </select>
                                {errors?.LG_LSTID && (
                                    <div className="invalid-feedback">
                                        {errors.LG_LSTID?.message}
                                    </div>
                                )}
                            </div>
                            <div className="col-md-6">
                                <label
                                    htmlFor="art_gamme"
                                    className="form-label"
                                >
                                    Adresse de livraison{" "}
                                </label>
                                <input
                                    type="text"
                                    id="STR_LIVADRESSE"
                                    {...register("STR_LIVADRESSE")}
                                    className={`form-control ${
                                        errors.STR_LIVADRESSE
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                />
                                {errors?.STR_LIVADRESSE && (
                                    <div className="invalid-feedback">
                                        {errors.STR_LIVADRESSE?.message}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="text-end mt-4">
                            <button type="submit" className="btn btn-success">
                                <i className="ri-check-double-fill me-1 align-bottom"></i>
                                Valider la commande{" "}
                                {isLoading && (
                                    <div
                                        className="spinner-border spinner-border-sm align-middle ms-2 ms-2 align-middle"
                                        role="status"
                                    >
                                        <span className="sr-only">
                                            Loading...
                                        </span>
                                    </div>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default Order;
