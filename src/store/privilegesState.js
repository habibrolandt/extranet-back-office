import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axiosInstance from "../axiosInstance";
import { toast } from "react-toastify";

const usePrivilegesState = create()(
    devtools((set) => ({
        privileges: {
            accessProducts: false,
            accessUsers: true,
            addBanners: true,
            closeDeliveryCalendar: true,
            viewDashboard: true,
            viewBanners: false,
            viewOrders: true,
            viewCustomerRequests: true,
            viewDeliveryAreas: true,
            viewDeliveryCalendar: true,
            viewProfiles: true,
            createUser: true,
            manageCustomerRequests: true,
            updateOrders: true,
            updateProducts: true,
            updateDeliveryAreas: true,
            updateDeliveryCalendar: true,
            modifyUsers: true,
            deleteBanners: true,
            deleteUsers: true,
            deleteDeliveryAreas: true,
            deleteDeliveryCalendar: true,
            validateOrders: false,
            viewCustomerList: false,
        },

        fetchPrivileges: async (LG_PROID) => {
            try {
                const response = await axiosInstance.post(
                    `ConfigurationManager.php`,
                    {
                        mode: "showPrivileges",
                        LG_PROID: LG_PROID,
                    },
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                if (response.data.code_statut === "1") {
                    set({ privileges: response.data.data });
                } else {
                    toast.error("Error: " + response.data.desc_statut);
                }
            } catch (error) {
                toast.error("Error: " + error.message);
            }
        },
    }))
);

export default usePrivilegesState;
