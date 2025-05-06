import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axiosInstance from "../axiosInstance";

const ACTION_TYPES = {
    DELETE_PRODUCT_SUBSTITUTIONS_REQUEST:
        "DELETE_PRODUCT_SUBSTITUTIONS_REQUEST",
    ADD_PRODUCT_SUBSTITUTIONS_REQUEST: "ADD_PRODUCT_SUBSTITUTIONS_REQUEST",
    ADD_PRODUCT_MAIN_PICTURE_REQUEST: "ADD_PRODUCT_MAIN_PICTURE_REQUEST",
    ADD_PRODUCT_THUMBS_PICTURES_REQUEST: "ADD_PRODUCT_THUMBS_PICTURES_REQUEST",
    FETCH_PRODUCT_PICTURES_REQUEST: "FETCH_PRODUCT_PICTURES_REQUEST",
    FETCH_PRODUCT_SUBSTITUTIONS_REQUEST: "FETCH_PRODUCT_SUBSTITUTIONS_REQUEST",
    DELETE_PRODUCT_MAIN_PICTURE_REQUEST: "DELETE_PRODUCT_MAIN_PICTURE_REQUEST",
    DELETE_PRODUCT_THUMBS_PICTURE_REQUEST:
        "DELETE_PRODUCT_THUMBS_PICTURE_REQUEST",
    FETCH_PRODUCT_REQUEST: "FETCH_PRODUCT_REQUEST",
    DELETE_PRODUCT_SUBSTITUTIONS_SUCCESS:
        "DELETE_PRODUCT_SUBSTITUTIONS_SUCCESS",
    ADD_PRODUCT_SUBSTITUTIONS_SUCCESS: "ADD_PRODUCT_SUBSTITUTIONS_SUCCESS",
    ADD_PRODUCT_MAIN_PICTURE_SUCCESS: "ADD_PRODUCT_MAIN_PICTURE_SUCCESS",
    ADD_PRODUCT_THUMBS_PICTURES_SUCCESS: "ADD_PRODUCT_THUMBS_PICTURES_SUCCESS",
    FETCH_PRODUCT_PICTURES_SUCCESS: "FETCH_PRODUCT_PICTURES_SUCCESS",
    FETCH_PRODUCT_SUBSTITUTIONS_SUCCESS: "FETCH_PRODUCT_SUBSTITUTIONS_SUCCESS",
    DELETE_PRODUCT_THUMBS_PICTURE_SUCCESS:
        "DELETE_PRODUCT_THUMBS_PICTURE_SUCCESS",
    DELETE_PRODUCT_MAIN_PICTURE_SUCCESS: "DELETE_PRODUCT_MAIN_PICTURE_SUCCESS",
    FETCH_PRODUCT_SUCCESS: "FETCH_PRODUCT_SUCCESS",
    DELETE_PRODUCT_SUBSTITUTIONS_FAILURE:
        "DELETE_PRODUCT_SUBSTITUTIONS_FAILURE",
    ADD_PRODUCT_SUBSTITUTIONS_FAILURE: "ADD_PRODUCT_SUBSTITUTIONS_FAILURE",
    ADD_PRODUCT_MAIN_PICTURE_FAILURE: "ADD_PRODUCT_MAIN_PICTURE_FAILURE",
    ADD_PRODUCT_THUMBS_PICTURES_FAILURE: "ADD_PRODUCT_THUMBS_PICTURES_FAILURE",
    FETCH_PRODUCT_PICTURES_FAILURE: "FETCH_PRODUCT_PICTURES_FAILURE",
    FETCH_PRODUCT_SUBSTITUTIONS_FAILURE: "FETCH_PRODUCT_SUBSTITUTIONS_FAILURE",
    FETCH_PRODUCT_FAILURE: "FETCH_PRODUCT_FAILURE",
    DELETE_PRODUCT_MAIN_PICTURE_FAILURE: "DELETE_PRODUCT_MAIN_PICTURE_FAILURE",
    DELETE_PRODUCT_THUMBS_PICTURE_FAILURE:
        "DELETE_PRODUCT_THUMBS_PICTURE_FAILURE",
};

const productReducer = (state, action) => {
    switch (action.type) {
        case ACTION_TYPES.DELETE_PRODUCT_SUBSTITUTIONS_REQUEST:
            return { ...state, loading: true, error: null };
        case ACTION_TYPES.ADD_PRODUCT_SUBSTITUTIONS_REQUEST:
            return { ...state, loading: true, error: null };
        case ACTION_TYPES.ADD_PRODUCT_MAIN_PICTURE_REQUEST:
            return { ...state, loading: true, error: null };
        case ACTION_TYPES.ADD_PRODUCT_THUMBS_PICTURES_REQUEST:
            return { ...state, loading: true, error: null };
        case ACTION_TYPES.FETCH_PRODUCT_PICTURES_REQUEST:
            return { ...state, loading: true, error: null };
        case ACTION_TYPES.FETCH_PRODUCT_SUBSTITUTIONS_REQUEST:
            return { ...state, loading: true, error: null };
        case ACTION_TYPES.DELETE_PRODUCT_MAIN_PICTURE_REQUEST:
            return { ...state, error: null, loading: true };
        case ACTION_TYPES.FETCH_PRODUCT_REQUEST:
            return { ...state, loading: true, error: null };
        case ACTION_TYPES.DELETE_PRODUCT_SUBSTITUTIONS_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                productSubsitutions: state.productSubsitutions.filter(
                    (item) => item.lg_prosubid !== action.payload
                ),
            };
        case ACTION_TYPES.ADD_PRODUCT_SUBSTITUTIONS_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                productSubsitutions: [
                    ...state.productSubsitutions,
                    ...action.payload.success,
                ],
            };
        case ACTION_TYPES.ADD_PRODUCT_MAIN_PICTURE_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                productPictures: [
                    ...state.productPictures,
                    { ...action.payload, isMain: true },
                ],
            };
        case ACTION_TYPES.ADD_PRODUCT_THUMBS_PICTURES_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                productPictures: [
                    ...state.productPictures,
                    ...action.payload.map((picture) => ({
                        ...picture,
                        isMain: false,
                    })),
                ],
            };
        case ACTION_TYPES.FETCH_PRODUCT_PICTURES_SUCCESS:
            return {
                ...state,
                loading: false,
                productPictures: action.payload,
                error: null,
            };
        case ACTION_TYPES.FETCH_PRODUCT_SUBSTITUTIONS_SUCCESS:
            return {
                ...state,
                loading: false,
                productSubsitutions: action.payload,
                error: null,
            };
        case ACTION_TYPES.DELETE_PRODUCT_THUMBS_PICTURE_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                productPictures: state.productPictures.filter(
                    (picture) => picture.id !== action.payload
                ),
            };
        case ACTION_TYPES.DELETE_PRODUCT_MAIN_PICTURE_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                productPictures: state.productPictures.filter(
                    (picture) => picture.isMain !== true
                ),
            };
        case ACTION_TYPES.FETCH_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                product: action.payload,
                error: null,
            };
        case ACTION_TYPES.DELETE_PRODUCT_SUBSTITUTIONS_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case ACTION_TYPES.ADD_PRODUCT_SUBSTITUTIONS_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case ACTION_TYPES.ADD_PRODUCT_MAIN_PICTURE_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case ACTION_TYPES.ADD_PRODUCT_THUMBS_PICTURES_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case ACTION_TYPES.FETCH_PRODUCT_PICTURES_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case ACTION_TYPES.FETCH_PRODUCT_SUBSTITUTIONS_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case ACTION_TYPES.FETCH_PRODUCT_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case ACTION_TYPES.DELETE_PRODUCT_MAIN_PICTURE_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case ACTION_TYPES.DELETE_PRODUCT_THUMBS_PICTURE_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

const initialState = {
    product: null,
    productPictures: [],
    productSubsitutions: null,
    loading: false,
    error: null,
};

const useProductStore = create()(
    devtools((set) => ({
        state: initialState,
        dispatch: (action) =>
            set((state) => ({
                state: productReducer(state.state, action), // Utilisation du reducer
            })),
        fetchProduct: async (LG_PROID) => {
            const dispatch = useProductStore.getState().dispatch;
            dispatch({ type: ACTION_TYPES.FETCH_PRODUCT_REQUEST });
            try {
                const response = await axiosInstance.post(
                    `StockManager.php`,
                    {
                        mode: "getProduct",
                        LG_PROID: LG_PROID,
                    },
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                const product = response.data.products[0];
                dispatch({
                    type: ACTION_TYPES.FETCH_PRODUCT_SUCCESS,
                    payload: product,
                });
            } catch (error) {
                dispatch({
                    type: ACTION_TYPES.FETCH_PRODUCT_FAILURE,
                    payload: error.message,
                });
            }
        },
        fetchProductPictures: async (LG_PROID) => {
            const dispatch = useProductStore.getState().dispatch;
            dispatch({ type: ACTION_TYPES.FETCH_PRODUCT_PICTURES_REQUEST });
            try {
                const response = await axiosInstance.post(
                    `ConfigurationManager.php`,
                    {
                        mode: "showAllProductImages",
                        LG_PROID: LG_PROID,
                    }, // Pas de données dans le corps de la requête
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                    }
                );
                const pictures = response.data.data;

                dispatch({
                    type: ACTION_TYPES.FETCH_PRODUCT_PICTURES_SUCCESS,
                    payload: pictures,
                });
            } catch (error) {
                dispatch({
                    type: ACTION_TYPES.FETCH_PRODUCT_PICTURES_FAILURE,
                    payload: error.message,
                });
            }
        },
        fetchProductSubsitutions: async (LG_PROID) => {
            const dispatch = useProductStore.getState().dispatch;
            dispatch({
                type: ACTION_TYPES.FETCH_PRODUCT_SUBSTITUTIONS_REQUEST,
            });
            try {
                const response = await axiosInstance.post(
                    `StockManager.php`,
                    {
                        mode: "getSubstitutionProducts",
                        LG_PROID: LG_PROID,
                    },
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                    }
                );
                const substitutions = response.data.products;
                dispatch({
                    type: ACTION_TYPES.FETCH_PRODUCT_SUBSTITUTIONS_SUCCESS,
                    payload: substitutions,
                });
            } catch (error) {
                dispatch({
                    type: ACTION_TYPES.FETCH_PRODUCT_SUBSTITUTIONS_FAILURE,
                    payload: error.message,
                });
            }
        },
        addProductMainPicture: async (FILE, LG_PROID) => {
            const dispatch = useProductStore.getState().dispatch;
            dispatch({ type: ACTION_TYPES.ADD_PRODUCT_MAIN_PICTURE_REQUEST });
            try {
                const formData = new FormData();
                formData.append("mode", "uploadMainImageProduct");
                formData.append("LG_PROID", LG_PROID);
                formData.append("images[main]", FILE);

                const response = await axiosInstance.post(
                    `ConfigurationManager.php`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                if (response.data.code_statut === "1") {
                    console.log(response.data.desc_statut);
                    dispatch({
                        type: ACTION_TYPES.ADD_PRODUCT_MAIN_PICTURE_SUCCESS,
                        payload: response.data.data[0],
                    });
                } else {
                    console.error(response.data.desc_statut);
                    dispatch({
                        type: ACTION_TYPES.ADD_PRODUCT_MAIN_PICTURE_FAILURE,
                        payload: response.data.desc_statut,
                    });
                }
            } catch (error) {
                console.error(error);
                dispatch({
                    type: ACTION_TYPES.ADD_PRODUCT_MAIN_PICTURE_FAILURE,
                    payload: error.message,
                });
            }
        },
        addProductThumbsPictures: async (FILES, LG_PROID) => {
            const dispatch = useProductStore.getState().dispatch;
            dispatch({
                type: ACTION_TYPES.ADD_PRODUCT_THUMBS_PICTURES_REQUEST,
            });
            try {
                const formData = new FormData();
                formData.append("mode", "uploadThumbImagesProduct");
                formData.append("LG_PROID", LG_PROID);
                if (FILES.length > 0) {
                    for (let i = 0; i < FILES.length; i++) {
                        formData.append(`images[thumbnail][]`, FILES[i]);
                    }
                }
                const response = await axiosInstance.post(
                    "ConfigurationManager.php",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                if (response.data.code_statut === "1") {
                    dispatch({
                        type: ACTION_TYPES.ADD_PRODUCT_THUMBS_PICTURES_SUCCESS,
                        payload: response.data.data,
                    });
                } else {
                    dispatch({
                        type: ACTION_TYPES.ADD_PRODUCT_THUMBS_PICTURES_FAILURE,
                        payload: response.data.desc_statut,
                    });
                }
            } catch (error) {
                dispatch({
                    type: ACTION_TYPES.DELETE_PRODUCT_THUMBS_PICTURE_FAILURE,
                    payload: error.message,
                });
            }
        },
        addProductSubstitutions: async (LG_PROID, substitutions) => {
            const dispatch = useProductStore.getState().dispatch;
            dispatch({
                type: ACTION_TYPES.ADD_PRODUCT_SUBSTITUTIONS_REQUEST,
            });
            try {
                const formData = new FormData();
                formData.append("mode", "createProductSubstitution");
                formData.append("LG_PROID", LG_PROID);
                substitutions.forEach((element, index) => {
                    formData.append(`LG_PROKIDIDS[${index}]`, element.value);
                });

                const response = await axiosInstance.post(
                    "ConfigurationManager.php",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                if (response.data.code_statut === "1") {
                    dispatch({
                        type: ACTION_TYPES.ADD_PRODUCT_SUBSTITUTIONS_SUCCESS,
                        payload: response.data.data,
                    });
                } else {
                    dispatch({
                        type: ACTION_TYPES.ADD_PRODUCT_SUBSTITUTIONS_FAILURE,
                        payload: response.data.desc_statut,
                    });
                }
            } catch (error) {
                dispatch({
                    type: ACTION_TYPES.ADD_PRODUCT_SUBSTITUTIONS_FAILURE,
                    payload: error.message,
                });
            }
        },
        deleteProductMainPicture: async (LG_PROID) => {
            const dispatch = useProductStore.getState().dispatch;
            dispatch({
                type: ACTION_TYPES.DELETE_PRODUCT_MAIN_PICTURE_REQUEST,
            });
            try {
                const response = await axiosInstance.post(
                    `ConfigurationManager.php`,
                    {
                        mode: "deleteProductMainImage",
                        LG_PROID: LG_PROID,
                    },
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                    }
                );
                if (response.data.code_statut === "1") {
                    console.log(response);
                    dispatch({
                        type: ACTION_TYPES.DELETE_PRODUCT_MAIN_PICTURE_SUCCESS,
                    });
                } else {
                    console.error(response.data.desc_statut);
                    dispatch({
                        type: ACTION_TYPES.DELETE_PRODUCT_MAIN_PICTURE_FAILURE,
                        payload: response.data.desc_statut,
                    });
                }
            } catch (error) {
                console.error(error);
                dispatch({
                    type: ACTION_TYPES.DELETE_PRODUCT_MAIN_PICTURE_FAILURE,
                    payload: error.message,
                });
            }
        },
        deleteProductThumbsPicture: async (LG_DOCID) => {
            const dispatch = useProductStore.getState().dispatch;
            dispatch({
                type: ACTION_TYPES.DELETE_PRODUCT_THUMBS_PICTURE_REQUEST,
            });
            try {
                const response = await axiosInstance.post(
                    `ConfigurationManager.php`,
                    {
                        mode: "deleteProductImage",
                        LG_DOCID: LG_DOCID,
                    },
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                    }
                );
                if (response.data.code_statut === "1") {
                    console.log(response);
                    dispatch({
                        type: ACTION_TYPES.DELETE_PRODUCT_THUMBS_PICTURE_SUCCESS,
                        payload: LG_DOCID,
                    });
                } else {
                    console.error(response.data.desc_statut);
                    dispatch({
                        type: ACTION_TYPES.DELETE_PRODUCT_THUMBS_PICTURE_FAILURE,
                        payload: response.data.desc_statut,
                    });
                }
            } catch (error) {
                console.error(error);
                dispatch({
                    type: ACTION_TYPES.DELETE_PRODUCT_THUMBS_PICTURE_FAILURE,
                    payload: error.message,
                });
            }
        },
        deleteProductSubstitution: async (LG_PROSUBID) => {
            const dispatch = useProductStore.getState().dispatch;
            dispatch({
                type: ACTION_TYPES.DELETE_PRODUCT_SUBSTITUTIONS_REQUEST,
            });
            try {
                const response = await axiosInstance.post(
                    "ConfigurationManager.php",
                    {
                        mode: "deleteProduitSubstitution",
                        LG_PROSUBID: LG_PROSUBID,
                    },
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                if (response.data.code_statut === "1") {
                    dispatch({
                        type: ACTION_TYPES.DELETE_PRODUCT_SUBSTITUTIONS_SUCCESS,
                        payload: LG_PROSUBID,
                    });
                } else {
                    dispatch({
                        type: ACTION_TYPES.DELETE_PRODUCT_SUBSTITUTIONS_FAILURE,
                        payload: response.data.desc_statut,
                    });
                }
            } catch (error) {
                dispatch({
                    type: ACTION_TYPES.DELETE_PRODUCT_SUBSTITUTIONS_FAILURE,
                    payload: error.message,
                });
            }
        },
        updateProductField: (field, value) => {
            set((state) =>
                productReducer(state, {
                    type: "UPDATE_PRODUCT_FIELD",
                    payload: { field, value },
                })
            );
        },
    }))
);

export default useProductStore;
