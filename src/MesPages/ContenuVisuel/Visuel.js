import React, { useState } from "react";
import { crudData, endpoint, mode } from "../../services/apiService";
import axios from "axios";
import { useLoaderData } from "react-router-dom";
import Banner from "../../Mescomposants/BanniereList/Bannière";
import { toast } from "react-toastify";

export async function bannerListLoader() {
    let data = null;
    const payload = new FormData();
    payload.append("mode", mode.listDocumentsMode);
    payload.append(
        "FILTER_OPTIONS[LG_LSTID]",
        "0000000000000000000000000000000000000792"
    );
    payload.append("FILTER_OPTIONS[DISABLE]", true);
    try {
        const response = await crudData(
            payload,
            endpoint.configurationManagerEndpoint
        );
        if (response.data.code_statut === "1") {
            data = response.data.data;
        } else {
            console.error(response.data.desc_statut);
        }
    } catch (error) {
        console.error(error);
    }

    return data;
}

function Visuel() {
    let currentUser = JSON.parse(localStorage.getItem("user"));
    const banners = useLoaderData();
    const [bannerList, setBannerList] = useState(banners || []);
    const [picturesUpload, setPicturesUpload] = useState([]);

    const resetUploadBanner = () => {
        setPicturesUpload([]);
    };
    const uploadBanner = (file) => {
        const oldPicturesUpload = [...picturesUpload];
        setPicturesUpload([...oldPicturesUpload, file]);
    };

    const removeUploadBanner = (index) => {
        setPicturesUpload((picturesUpload) =>
            picturesUpload.filter((item, i) => index !== i)
        );
    };

    const handleDeleteBanner = async (bannerId) => {
        const payload = {
            mode: mode.deleteDocumentMode,
            LG_DOCID: bannerId,
        };

        try {
            const response = await crudData(
                payload,
                endpoint.configurationManagerEndpoint
            );
            if (response.data.code_statut === "1") {
                console.log(response);

                toast.success("Bannière supprimée avec succès");
                const updatedBannerList = bannerList.filter(
                    (banner) => banner.LG_DOCID !== bannerId
                );
                setBannerList(updatedBannerList);
            } else {
                console.error(response.data.desc_statut);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const addBanner = async (newBanner) => {
        const payload = {
            mode: mode.uploadOneOrSeveralDocumentsMode,
            STR_UTITOKEN: currentUser.STR_UTITOKEN,
            documents: newBanner,
        };

        try {
            const response = await crudData(
                payload,
                endpoint.configurationManagerEndpoint,
                true
            );
            if (response.data.code_statut === "1") {
                console.log(response);

                toast.success("Bannière ajoutée avec succès");

                setBannerList([...bannerList, ...response.data.data]);
            } else {
                console.error(response.data.desc_statut);
            }
            return true;
        } catch (error) {
            console.error(error);
        }
    };

    const handleChangeBannerStatut = async (LG_DOCID) => {
        const payload = {
            mode: mode.changeDocumentStatutMode,
            STR_UTITOKEN: currentUser.STR_UTITOKEN,
            LG_DOCID: LG_DOCID,
        };

        try {
            const response = await crudData(
                payload,
                endpoint.configurationManagerEndpoint,
                true
            );
            if (response.data.code_statut === "1") {
                toast.success(
                    bannerList.find((banner) => banner.LG_DOCID === LG_DOCID)
                        .STR_DOCSTATUT === "disable"
                        ? "Bannière activé avec succès"
                        : "Bannière désactivé avec succès"
                );

                const newList = bannerList.map((banner) => {
                    if (banner.LG_DOCID === LG_DOCID) {
                        return {
                            ...banner,
                            STR_DOCSTATUT:
                                banner.STR_DOCSTATUT === "disable"
                                    ? "enable"
                                    : "disable",
                        };
                    }
                    return banner;
                });

                setBannerList((prev) => newList);
            } else {
                console.error(response.data.desc_statut);
            }
            return true;
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="row">
            <Banner
                bannerList={bannerList}
                onHandleDeleteBanner={handleDeleteBanner}
                onHandleUploadBanner={uploadBanner}
                onRemoveUploadBanner={removeUploadBanner}
                onResetUploadBanner={resetUploadBanner}
                picturesUpload={picturesUpload}
                onAddBanner={addBanner}
                onHandleChangeBannerStatut={handleChangeBannerStatut}
            />
        </div>
    );
}

export default Visuel;
