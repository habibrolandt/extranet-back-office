import React from "react";
import "./ButtonAddPicture.css";

function ButtonAddPicture({ customSize = null, modalId }) {
    return (
        <div className="add-button-container" style={customSize}>
            <button
                className="add-button"
                data-bs-toggle="modal"
                data-bs-target={`#${modalId}`}
            >
                <span>
                    <i className="ri-add-line"></i>
                </span>
            </button>
        </div>
    );
}

export default ButtonAddPicture;
