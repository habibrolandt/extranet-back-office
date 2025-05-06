import { toast } from "react-toastify";
import axiosInstance from "../axiosInstance";
import {
    parameterAgenceSocietyID,
    parameterStatutEnable,
} from "../services/apiService";

export const createUser = async (data) => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await axiosInstance.post(
            `ConfigurationManager.php`,
            {
                mode: "createUtilisateur",
                STR_UTIFIRSTLASTNAME: data.STR_UTIFIRSTLASTNAME,
                STR_UTIPHONE: data.STR_UTIPHONE,
                STR_UTIMAIL: data.STR_UTIMAIL,
                STR_UTILOGIN: data.STR_UTILOGIN,
                STR_UTIPASSWORD: data.STR_UTIPASSWORD,
                LG_PROID: data.LG_PROID,
                STR_UTITOKEN: user.STR_UTITOKEN,
                STR_UTISTATUT: parameterStatutEnable,
                LG_AGEID: parameterAgenceSocietyID,
            },
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        if (response.data.code_statut === "1") {
            toast.success(response.data.desc_statut);
            return true;
        } else {
            toast.error(response.data.desc_statut);
            return false;
        }
    } catch (error) {
        toast.error("Error: " + error.message);
    }
};

export const updateUser = async (data) => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await axiosInstance.post(
            `ConfigurationManager.php`,
            {
                mode: "updateUtilisateur",
                LG_UTIID: data.LG_UTIID,
                STR_UTIFIRSTLASTNAME: data.STR_UTIFIRSTLASTNAME,
                STR_UTIPHONE: data.STR_UTIPHONE,
                STR_UTIMAIL: data.STR_UTIMAIL,
                STR_UTILOGIN: data.STR_UTILOGIN,
                STR_UTIPASSWORD: data.STR_UTIPASSWORD,
                LG_PROID: data.LG_PROID,
                STR_UTITOKEN: user.STR_UTITOKEN,
                STR_UTISTATUT: parameterStatutEnable,
                LG_AGEID: parameterAgenceSocietyID,
                STR_UTIPIC: data.STR_UTIPIC ?? null,
            },
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        if (response.data.code_statut === "1") {
            toast.success(response.data.desc_statut);
            return typeof response.data.data.STR_UTIPIC === "string"
                ? response.data.data.STR_UTIPIC
                : true;
        } else {
            toast.error(response.data.desc_statut);
            return false;
        }
    } catch (error) {
        toast.error("Error: " + error.message);
    }
};

export const deleteUser = async (UTIID) => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await axiosInstance.post(
            `ConfigurationManager.php`,
            {
                mode: "deleteUtilisateur",
                LG_UTIID: UTIID,
                STR_UTITOKEN: user.STR_UTITOKEN,
            },
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        if (response.data.code_statut === "1") {
            // toast.success(response.data.desc_statut);
            return true;
        } else {
            toast.error(response.data.desc_statut);
            return false;
        }
    } catch (error) {
        toast.error("Error: " + error.message);
    }
};

export const fetchUserData = async (userID) => {
    const requestParams = {
        mode: "getUtilisateur",
        LG_UTIID: userID,
    };
    try {
        const response = await axiosInstance.post(
            `ConfigurationManager.php`,
            requestParams,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        if (response && response.data.code_statut === "1") {
            return response.data.data;
        } else {
            toast.error(response.data.desc_statut);
        }
    } catch (error) {
        toast.error(error.message);
    }
};

export const fetchSystemProfils = async (input) => {
    try {
        const response = await axiosInstance.post(
            `ConfigurationManager.php`,
            {
                mode: "listProfile",
                LIMIT: "99999",
                PAGE: "1",
                "FILTER_OPTIONS[lg_lstid]":
                    "0000000000000000000000000000000000000793",
                "FILTER_OPTIONS[search]": input,
            },
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        if (response.data.code_statut === "1") {
            const defaultOptions = response.data.data.map((item) => ({
                label: item.PRODESCRIPTION,
                value: item.PROID,
            }));

            return defaultOptions;
        } else {
            toast.error(response.data.desc_statut);
        }
    } catch (error) {
        toast.error("Error: " + error.message);
    }
};
