import React from "react";
import "./ImageCard.css";
import { fullUrl } from "../../services/apiService";

function ImageCard({ image, onDelete }) {
    return (
        <div className="col-md-6" style={{ width: "223.333px" }}>
            <div className="card card-hover" style={{ width: "223.333px" }}>
                <img
                    src={`${fullUrl}${image.src}`}
                    alt={image.id}
                    className="card-img-top"
                />
                <div className="overlay">
                    <button className="btn btn-delete" onClick={onDelete}>
                        <i className="ri-delete-bin-line"></i> Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ImageCard;
