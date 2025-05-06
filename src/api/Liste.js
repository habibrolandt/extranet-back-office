import { toast } from "react-toastify";
import axiosInstance from "../axiosInstance";

export const fetchTypeProfil = async () => {
    try {
        const response = await axiosInstance.post(
            `ConfigurationManager.php`,
            {
                mode: "listElements",
                LG_TYLID: "9",
                // search_value: search,
            },
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        if (response.data.code_statut === "1") {
            const defaultOptions = response.data.data.map((item) => ({
                label: item.STR_LSTDESCRIPTION,
                value: item.LG_LSTID,
            }));
            return defaultOptions;
        } else {
            toast.error(response.data.desc_statut);
        }
    } catch (error) {
        toast.error("Error: " + error.message);
    }
};

export const handleCreate = async (value, LG_TYLID) => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await axiosInstance.post(
            `ConfigurationManager.php`,
            {
                mode: "createListe",
                LG_TYLID: LG_TYLID,
                STR_LSTDESCRIPTION: value,
                STR_LSTVALUE: value,
                STR_UTITOKEN: user.STR_UTITOKEN,
            },
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        if (response.data.code_statut === "1") {
            console.log({ label: value, value: response.data.LG_LSTID });

            return { label: value, value: response.data.LG_LSTID };
        } else {
            toast.error(response.data.desc_statut);
        }
    } catch (error) {
        toast.error("Error: " + error.message);
    }
};
