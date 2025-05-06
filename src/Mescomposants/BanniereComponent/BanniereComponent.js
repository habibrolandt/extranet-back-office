import React from "react";
import { fullUrl } from "../../services/apiService";
import "./BanniereComponent.css";

function BanniereComponent({
    item,
    deletedElement,
    onHandleSelectedElement,
    onHandleChangeBannerStatut,
}) {
    return (
        <div
            style={{ width: "600px" }}
            className={
                deletedElement === item.LG_DOCID ? "border border-danger" : ""
            }
        >
            <div className="card card-hover">
                <img
                    src={`${fullUrl + item.STR_DOCPATH}`}
                    alt={`bannière ${item.LG_DOCID}`}
                    className="card-img-top"
                />
                <div className="overlay">
                    <button
                        className="btn btn-light"
                        style={{ marginRight: "20px" }}
                        onClick={() =>
                            onHandleChangeBannerStatut(item.LG_DOCID)
                        }
                    >
                        <i className="ri-eye-off-line"></i>{" "}
                        {item.STR_DOCSTATUT === "enable"
                            ? "Desactivé"
                            : "Activé"}
                    </button>
                    <button
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModalgrid3"
                        className="btn btn-danger"
                        onClick={() => onHandleSelectedElement(item.LG_DOCID)}
                    >
                        <i className="ri-delete-bin-line"></i> Supprimer
                    </button>
                </div>
                {item.STR_DOCSTATUT === "disable" && (
                    <div className="disable bg-light text-black">
                        <span>Désactivé</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default BanniereComponent;
