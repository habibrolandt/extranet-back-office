import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axiosInstance from "../axiosInstance";

const ACTION_TYPES = {
    FETCH_ORDER_DETAILS_REQUEST: "FETCH_ORDER_DETAILS_REQUEST",
    FETCH_ORDER_DETAILS_SUCCESS: "FETCH_ORDER_DETAILS_SUCCESS",
    FETCH_ORDER_DETAILS_FAILURE: "FETCH_ORDER_DETAILS_FAILURE",
    FETCH_ORDER_PRODUCTS_REQUEST: "FETCH_ORDER_DETAILS_REQUEST",
    FETCH_ORDER_PRODUCTS_SUCCESS: "FETCH_ORDER_PRODUCTS_SUCCESS",
    FETCH_ORDER_PRODUCTS_FAILURE: "FETCH_ORDER_PRODUCTS_FAILURE",
    UPDATE_PRODUCT_QUANTITY_REQUEST: "UPDATE_PRODUCT_QUANTITY_REQUEST",
    UPDATE_PRODUCT_QUANTITY_SUCCESS: "UPDATE_PRODUCT_QUANTITY_SUCCESS",
    UPDATE_PRODUCT_QUANTITY_FAILURE: "UPDATE_PRODUCT_QUANTITY_FAILURE",
    DELETE_PRODUCT_ON_ORDER_REQUEST: "CHANGE_PRODUCT_QUANTITY_FAILURE",
    DELETE_PRODUCT_ON_ORDER_SUCCESS: "DELETE_PRODUCT_ON_ORDER_SUCCESS",
    DELETE_PRODUCT_ON_ORDER_FAILURE: "DELETE_PRODUCT_ON_ORDER_FAILURE",
    ORDER_VALIDATION_REQUEST: "ORDER_VALIDATION_REQUEST",
    ORDER_VALIDATION_SUCCESS: "ORDER_VALIDATION_SUCCESS",
    ORDER_VALIDATION_FAILURE: "ORDER_VALIDATION_FAILURE",
    ADD_PRODUCT_TO_ORDER_REQUEST: "ADD_PRODUCT_TO_ORDER_REQUEST",
    ADD_PRODUCT_TO_ORDER_SUCCESS: "ADD_PRODUCT_TO_ORDER_SUCCESS",
    ADD_PRODUCT_TO_ORDER_FAILURE: "ADD_PRODUCT_TO_ORDER_FAILURE",
};

const orderReducer = (state, action) => {
    switch (action.type) {
        case ACTION_TYPES.FETCH_ORDER_DETAILS_REQUEST:
            return { ...state, loading: true, error: null };
        case ACTION_TYPES.FETCH_ORDER_DETAILS_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                order: action.payload,
                canFetchOrderProducts: true
            };
        case ACTION_TYPES.FETCH_ORDER_DETAILS_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case ACTION_TYPES.FETCH_ORDER_PRODUCTS_REQUEST:
            return { ...state, loading: true, error: null };
        case ACTION_TYPES.FETCH_ORDER_PRODUCTS_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                orderProducts: action.payload,
                canFetchOrderProducts: false
            };
        case ACTION_TYPES.FETCH_ORDER_PRODUCTS_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case ACTION_TYPES.UPDATE_PRODUCT_QUANTITY_REQUEST:
            return { ...state, loading: true, error: null };
        case ACTION_TYPES.UPDATE_PRODUCT_QUANTITY_SUCCESS: {
            const updatedOrderProducts = state.orderProducts.map((product) => {
                if (product.LG_CPRID !== action.payload.LG_CPRID) {
                    return product;
                } else {
                    return {
                        ...product,
                        int_cprquantity: action.payload.quantity,
                    };
                }
            });
            return {
                ...state,
                loading: false,
                error: null,
                orderProducts: updatedOrderProducts,
                order: {
                    ...state.order,
                    dbl_commmtht: parseInt(action.payload.PcvMtHT),
                    dbl_commmtttc: parseInt(action.payload.PcvMtTTC),
                },
            };
        }
        case ACTION_TYPES.UPDATE_PRODUCT_QUANTITY_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case ACTION_TYPES.ADD_PRODUCT_TO_ORDER_REQUEST:
            return { ...state, loading: true, error: null };
        case ACTION_TYPES.ADD_PRODUCT_TO_ORDER_SUCCESS: {
            return {
                ...state,
                loading: false,
                error: null,
                orderProducts: [...state.orderProducts, ...action.payload],
            };
        }
        case ACTION_TYPES.ADD_PRODUCT_TO_ORDER_FAILURE:
            return { ...state, loading: true, error: false };
        case ACTION_TYPES.DELETE_PRODUCT_ON_ORDER_REQUEST:
            return { ...state, loading: true, error: null };
        case ACTION_TYPES.DELETE_PRODUCT_ON_ORDER_SUCCESS: {
            const updatedOrderProducts = state.orderProducts.filter(
                (product) => product.LG_CPRID !== action.payload.LG_CPRID
            );
            return {
                ...state,
                loading: false,
                error: null,
                orderProducts: updatedOrderProducts,
                order: {
                    ...state.order,
                    dbl_commmtht: parseInt(action.payload.PcvMtHT),
                    dbl_commmtttc: parseInt(action.payload.PcvMtTTC),
                },
            };
        }
        case ACTION_TYPES.DELETE_PRODUCT_ON_ORDER_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case ACTION_TYPES.ORDER_VALIDATION_REQUEST:
            return { ...state, loading: true, error: null };
        case ACTION_TYPES.ORDER_VALIDATION_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                order: {
                    ...state.order,
                    str_commstatut: "closed",
                },
            };
        case ACTION_TYPES.ORDER_VALIDATION_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            break;
    }
};

const initialState = {
    order: null,
    orderProducts: null,
    loading: false,
    error: null,
    canFetchOrderProducts: false
};

const useOrderState = create()(
    devtools((set) => ({
        state: initialState,
        dispatch: (action) => {
            set((state) => ({
                state: orderReducer(state.state, action),
            }));
        },
        fetchOrderDetails: async (LG_COMMID) => {
            const dispatch = useOrderState.getState().dispatch;
            dispatch({ type: ACTION_TYPES.FETCH_ORDER_DETAILS_REQUEST });
            try {
                const response = await axiosInstance.post(
                    `CommandeManager.php`,
                    {
                        mode: "getCommande",
                        LG_COMMID: LG_COMMID,
                    },
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                if (response.data.code_statut === "1") {
                    dispatch({
                        type: ACTION_TYPES.FETCH_ORDER_DETAILS_SUCCESS,
                        payload: response.data.data,
                    });
                } else {
                    dispatch({
                        type: ACTION_TYPES.FETCH_ORDER_DETAILS_FAILURE,
                        payload: response.data.desc_statut,
                    });
                }
            } catch (error) {
                dispatch({
                    type: ACTION_TYPES.FETCH_ORDER_DETAILS_FAILURE,
                    payload: error.message,
                });
            }
        },
        fetchOrderProducts: async (LG_COMMID) => {
            const dispatch = useOrderState.getState().dispatch;
            dispatch({ type: ACTION_TYPES.FETCH_ORDER_PRODUCTS_REQUEST });
            try {
                const response = await axiosInstance.post(
                    "CommandeManager.php",
                    {
                        mode: "listProductByCommande",
                        LG_COMMID: LG_COMMID,
                    },
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                if (response.data.code_statut === "1") {
                    dispatch({
                        type: ACTION_TYPES.FETCH_ORDER_PRODUCTS_SUCCESS,
                        payload: response.data.products,
                    });
                } else {
                    dispatch({
                        type: ACTION_TYPES.FETCH_ORDER_PRODUCTS_FAILURE,
                        payload: response.data.desc_statut,
                    });
                }
            } catch (error) {
                dispatch({
                    type: ACTION_TYPES.FETCH_ORDER_PRODUCTS_FAILURE,
                    payload: error.message,
                });
            }
        },
        updateProductQuantity: async (quantity, LG_CPRID) => {
            const dispatch = useOrderState.getState().dispatch;
            dispatch({ type: ACTION_TYPES.UPDATE_PRODUCT_QUANTITY_REQUEST });
            const user = JSON.parse(localStorage.getItem("user"));
            try {
                const response = await axiosInstance.post(
                    "CommandeManager.php",
                    {
                        mode: "updateCommproduit",
                        LG_CPRID: LG_CPRID,
                        INT_CPRQUANTITY: parseInt(quantity),
                        STR_UTITOKEN: user.STR_UTITOKEN,
                    },
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                if (response.data.code_statut === "1") {
                    dispatch({
                        type: ACTION_TYPES.UPDATE_PRODUCT_QUANTITY_SUCCESS,
                        payload: {
                            quantity: quantity,
                            LG_CPRID: LG_CPRID,
                            PcvMtHT: response.data.PcvMtHT,
                            PcvMtTTC: response.data.PcvMtTTC,
                        },
                    });
                } else {
                    dispatch({
                        type: ACTION_TYPES.UPDATE_PRODUCT_QUANTITY_FAILURE,
                        payload: response.data.desc_statut,
                    });
                }
            } catch (error) {
                dispatch({
                    type: ACTION_TYPES.UPDATE_PRODUCT_QUANTITY_FAILURE,
                    payload: error.message,
                });
            }
        },
        addProductToOrder: async (LG_AGEID, CMD_DATA, LG_COMMID) => {
            const dispatch = useOrderState.getState().dispatch;
            dispatch({ type: ACTION_TYPES.ADD_PRODUCT_TO_ORDER_REQUEST });
            const user = JSON.parse(localStorage.getItem("user"));
            try {
                const response = await axiosInstance.post(
                    "CommandeManager.php",
                    {
                        mode: "createCommproduit",
                        LG_AGEID: LG_AGEID,
                        STR_COMMNAME: "",
                        STR_COMMADRESSE: "Plateau, Pullman",
                        STR_LIVADRESSE: "Zone 4, marcory",
                        STR_UTITOKEN: user.STR_UTITOKEN,
                        CMD_DATA: JSON.stringify(CMD_DATA),
                        LG_COMMID: LG_COMMID,
                    },
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                if (response.data.code_statut === "1") {
                    dispatch({
                        type: ACTION_TYPES.ADD_PRODUCT_TO_ORDER_SUCCESS,
                        payload: response.data.product_added_data,
                    });
                } else {
                    dispatch({
                        type: ACTION_TYPES.ADD_PRODUCT_TO_ORDER_FAILURE,
                        payload: response.data.desc_statut,
                    });
                }
            } catch (error) {
                dispatch({
                    type: ACTION_TYPES.ADD_PRODUCT_TO_ORDER_FAILURE,
                    payload: error.message,
                });
            }
        },
        deleteProductOnOrder: async (LG_CPRID) => {
            const dispatch = useOrderState.getState().dispatch;
            dispatch({ type: ACTION_TYPES.DELETE_PRODUCT_ON_ORDER_REQUEST });
            const user = JSON.parse(localStorage.getItem("user"));
            try {
                const response = await axiosInstance.post(
                    "CommandeManager.php",
                    {
                        mode: "deleteCommproduit",
                        LG_CPRID: LG_CPRID,
                        STR_UTITOKEN: user.STR_UTITOKEN,
                    },
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                if (response.data.code_statut === "1") {
                    dispatch({
                        type: ACTION_TYPES.DELETE_PRODUCT_ON_ORDER_SUCCESS,
                        payload: {
                            LG_CPRID: LG_CPRID,
                            PcvMtHT: response.data.PcvMtHT,
                            PcvMtTTC: response.data.PcvMtTTC,
                        },
                    });
                } else {
                    dispatch({
                        type: ACTION_TYPES.DELETE_PRODUCT_ON_ORDER_FAILURE,
                        payload: response.data.desc_statut,
                    });
                }
            } catch (error) {
                dispatch({
                    type: ACTION_TYPES.DELETE_PRODUCT_ON_ORDER_FAILURE,
                    payload: error.message,
                });
            }
        },
        orderValidation: async (LG_COMMID, STR_COMMLIVADRESSE, LG_ZONLIVID) => {
            const dispatch = useOrderState.getState().dispatch;
            dispatch({ type: ACTION_TYPES.ORDER_VALIDATION_REQUEST });
            const user = JSON.parse(localStorage.getItem("user"));
            try {
                const response = await axiosInstance.post(
                    "CommandeManager.php",
                    {
                        mode: "adminCartValidation",
                        LG_COMMID: LG_COMMID,
                        STR_COMMLIVADRESSE: STR_COMMLIVADRESSE,
                        LG_ZONLIVID: LG_ZONLIVID,
                        STR_UTITOKEN: user.STR_UTITOKEN,
                    },
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                if (response.data.code_statut === "1") {
                    dispatch({
                        type: ACTION_TYPES.ORDER_VALIDATION_SUCCESS,
                    });
                } else {
                    dispatch({
                        type: ACTION_TYPES.ORDER_VALIDATION_FAILURE,
                        payload: response.data.desc_statut,
                    });
                }
            } catch (error) {
                dispatch({
                    type: ACTION_TYPES.ORDER_VALIDATION_FAILURE,
                    payload: error.message,
                });
            }
        },
    }))
);

export default useOrderState;
