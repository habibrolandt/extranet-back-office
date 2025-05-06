import { toast } from "react-toastify";
import axiosInstance from "../axiosInstance";

export const createProfil = async (data, selectedOptions) => {
    try {
        const response = await axiosInstance.post(
            `ConfigurationManager.php`,
            {
                mode: "createProfil",
                STR_PRONAME: data.STR_PRONAME,
                STR_PRODESCRIPTION: data.STR_PRODESCRIPTION,
                LG_LSTID: data.LG_LSTID.value,
                LG_PRIIDS: selectedOptions.length > 0 ? selectedOptions : null,
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

export const updateProfil = async (data, selectedOptions) => {
    try {
        const response = await axiosInstance.post(
            `ConfigurationManager.php`,
            {
                mode: "updateProfil",
                LG_PROID: data.LG_PROID,
                STR_PRONAME: data.STR_PRONAME,
                STR_PRODESCRIPTION: data.STR_PRODESCRIPTION,
                LG_LSTID: data.LG_LSTID.value,
                LG_PRIIDS: selectedOptions.length > 0 ? selectedOptions : [],
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

export const fetchProfil = async (LG_PROID) => {
    try {
        const response = await axiosInstance.post(
            `ConfigurationManager.php`,
            {
                mode: "getProfile",
                LG_PROID: LG_PROID,
            },
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        if (response.data.code_statut === "1") {
            return response.data.data;
        } else {
            toast.error(response.data.desc_statut);
            return false;
        }
    } catch (error) {
        toast.error("Error: " + error.message);
    }
};

export const fetchProfilPrivileges = async (LG_PROID) => {
    try {
        const response = await axiosInstance.post(
            `ConfigurationManager.php`,
            {
                mode: "listProfilPrivileges",
                LG_PROID: LG_PROID,
            },
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        if (response.data.code_statut === "1") {
            return response.data.data;
        } else {
            toast.error(response.data.desc_statut);
            return false;
        }
    } catch (error) {
        toast.error("Error: " + error.message);
    }
};

export const deleteProfil = async (LG_PROID) => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await axiosInstance.post(
            `ConfigurationManager.php`,
            {
                mode: "deleteProfil",
                LG_PROID: LG_PROID,
                STR_UTITOKEN: user.STR_UTITOKEN,
            },
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        if (response.data.code_statut === "1") {
            return true;
        } else {
            toast.error(response.data.desc_statut);
            return false;
        }
    } catch (error) {
        toast.error("Error: " + error.message);
    }
};
