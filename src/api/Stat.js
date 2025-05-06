import { toast } from "react-toastify";
import axiosInstance from "../axiosInstance";

export const fetchStats = async (year) => {
    try {
        const response = await axiosInstance.post(
            `StatistiqueManager.php`,
            {
                mode: "statOrders",
                YEAR: year,
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

export const fetchProductStats = async (
    limit,
    page,
    search = null,
    month = null
) => {
    try {
        const response = await axiosInstance.post(
            `StatistiqueManager.php`,
            {
                mode: "listProductsStatViewed",
                LIMIT: limit,
                PAGE: page,
                "FILTER_OPTIONS[search]": search,
                "FILTER_OPTIONS[month]": month,
            },
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        if (response.data.code_statut === "1") {
            return response.data;
        } else {
            toast.error(response.data.desc_statut);
            return false;
        }
    } catch (error) {
        toast.error("Error: " + error.message);
    }
};

export const fetchPurchaserStats = async (
    limit,
    page,
    search = null,
    year = null
) => {
    try {
        const response = await axiosInstance.post(
            `StatistiqueManager.php`,
            {
                mode: "listBestPurchaser",
                LIMIT: limit,
                PAGE: page,
                "FILTER_OPTIONS[search]": search,
                YEAR: year,
            },
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        if (response.data.code_statut === "1") {
            return response.data;
        } else {
            toast.error(response.data.desc_statut);
            return false;
        }
    } catch (error) {
        toast.error("Error: " + error.message);
    }
};
