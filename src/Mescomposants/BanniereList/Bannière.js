import React, { useState } from "react";
import BanniereComponent from "../BanniereComponent/BanniereComponent";

function Banner({
    bannerList,
    onHandleDeleteBanner,
    onHandleUploadBanner,
    onRemoveUploadBanner,
    onResetUploadBanner,
    picturesUpload,
    onAddBanner,
    onHandleChangeBannerStatut,
}) {
    const [previewPictures, setPreviewPictures] = useState([]);
    const [deletedElement, setDeletedElement] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSelectedElement = (elementID) => {
        setDeletedElement(elementID);
    };

    const handleAddPreviewPicture = (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewPictures([...previewPictures, reader.result]);
            };
            reader.readAsDataURL(file);
        }

        const newPictures = {
            file: file,
            LG_LSTID: "0000000000000000000000000000000000000792",
        };
        onHandleUploadBanner(newPictures);
    };

    const handleRemovePreviewPicture = (e, index) => {
        if (index >= 0 && index < picturesUpload.length) {
            onRemoveUploadBanner(index);
            setPreviewPictures((previewPictures) =>
                previewPictures.filter((item, i) => index !== i)
            );
        } else {
            console.error("Index out of bounds");
        }
    };

    const handleSubmitPictures = () => {
        setIsLoading(true);
        try {
            if (onAddBanner(picturesUpload)) {
                onResetUploadBanner();
                setPreviewPictures([]);
            } else {
                console.error("Erreur lors du telechargement de l'image");
            }
            setIsLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="col-lg-12">
            <h1>Bannières</h1>
            <div className="card" id="invoiceList">
                <div className="card-body bg-light-subtle border border-dashed border-start-0 border-end-0">
                    <div
                        className="row"
                        style={{
                            width: "100%",
                            overflowX: "auto",
                            overflowY: "hidden",
                            whiteSpace: "nowrap",
                            position: "relative",
                            paddingBottom: "20px",
                        }}
                    >
                        <div style={{ display: "flex", gap: "20px" }}>
                            <Modal
                                onHandleAddPreviewPicture={
                                    handleAddPreviewPicture
                                }
                                picturesUpload={picturesUpload}
                                previewPictures={previewPictures}
                                onHandleRemovePreviewPicture={
                                    handleRemovePreviewPicture
                                }
                                onHandleSubmitPictures={handleSubmitPictures}
                                isLoading={isLoading}
                            />
                            <DeleteModal
                                deletedElement={deletedElement}
                                onHandleDeleteOne={onHandleDeleteBanner}
                                onHandleSelectedElement={handleSelectedElement}
                            />
                            <button
                                className="btn btn-sm edit-item-btn"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModalgrid2"
                                style={{
                                    width: "600px",
                                    height: "300px",
                                    backgroundColor: "#C3C5CD",
                                    flexShrink: 0,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "column",
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    width={80}
                                >
                                    <path d="M11 11V7H13V11H17V13H13V17H11V13H7V11H11ZM12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"></path>
                                </svg>
                                <p>Ajouter nouvelle bannière</p>
                            </button>
                            <div className="d-flex" style={{ gap: "20px" }}>
                                {bannerList.length > 0 &&
                                    bannerList.map((item, index) => (
                                        <BanniereComponent
                                            item={item}
                                            key={index}
                                            deletedElement={deletedElement}
                                            onHandleSelectedElement={
                                                handleSelectedElement
                                            }
                                            onHandleChangeBannerStatut={
                                                onHandleChangeBannerStatut
                                            }
                                        />
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Modal({
    onHandleAddPreviewPicture,
    picturesUpload,
    previewPictures,
    onHandleRemovePreviewPicture,
    onHandleSubmitPictures,
    isLoading,
}) {
    return (
        <div
            className="modal fade"
            id="exampleModalgrid2"
            tabIndex="-1"
            aria-labelledby="exampleModalgridLabel2"
            aria-modal="true"
        >
            <div className="modal-dialog" style={{ maxWidth: "1000px" }}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalgridLabel2">
                            Ajouter une bannière
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <div
                            className="dropzone dz-clickable"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                position: "relative",
                                cursor: "pointer",
                            }}
                        >
                            <div className="mb-3">
                                <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                            </div>
                            <h4>Cliquez pour télécharger.</h4>
                            <input
                                type="file"
                                id="upload"
                                name="banner"
                                onChange={onHandleAddPreviewPicture}
                                style={{
                                    position: "absolute",
                                    width: "100%",
                                    height: "100%",
                                    top: 0,
                                    left: 0,
                                    opacity: 0,
                                    cursor: "pointer",
                                }}
                            />
                        </div>
                        {picturesUpload.length > 0 && (
                            <>
                                <ul
                                    className="list-unstyled mb-0"
                                    id="dropzone-preview"
                                >
                                    {picturesUpload.map((item, index) => (
                                        <li
                                            className="mt-2 dz-processing dz-image-preview dz-success dz-complete"
                                            id=""
                                            key={index}
                                        >
                                            <div className="border rounded">
                                                <div className="d-flex p-2">
                                                    <div className="flex-shrink-0 me-3">
                                                        <div className="avatar-sm bg-light rounded">
                                                            <img
                                                                src={
                                                                    previewPictures[
                                                                        index
                                                                    ]
                                                                }
                                                                className="rounded"
                                                                alt=""
                                                                style={{
                                                                    width: "100%",
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <div className="pt-1">
                                                            <h5
                                                                className="fs-14 mb-1"
                                                                data-dz-name=""
                                                            >
                                                                {item.file.name}
                                                            </h5>
                                                            <p
                                                                className="fs-13 text-muted mb-0"
                                                                data-dz-size=""
                                                            >
                                                                <strong>
                                                                    {(
                                                                        item
                                                                            .file
                                                                            .size /
                                                                        (1024 *
                                                                            1024)
                                                                    ).toFixed(
                                                                        2
                                                                    )}
                                                                </strong>{" "}
                                                                MB
                                                            </p>
                                                            <strong
                                                                className="error text-danger"
                                                                data-dz-errormessage=""
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex-shrink-0 ms-3">
                                                        <button
                                                            // data-dz-remove=""
                                                            onClick={(e) =>
                                                                onHandleRemovePreviewPicture(
                                                                    e,
                                                                    index
                                                                )
                                                            }
                                                            className="btn btn-sm btn-danger"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 24 24"
                                                                fill="currentColor"
                                                                width={18}
                                                            >
                                                                <path d="M7 6V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7ZM13.4142 13.9997L15.182 12.232L13.7678 10.8178L12 12.5855L10.2322 10.8178L8.81802 12.232L10.5858 13.9997L8.81802 15.7675L10.2322 17.1817L12 15.4139L13.7678 17.1817L15.182 15.7675L13.4142 13.9997ZM9 4V6H15V4H9Z"></path>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <figure
                                    className="text-end"
                                    style={{ margin: 0 }}
                                >
                                    <button
                                        className="d-flex align-items-center justify-content-center btn btn-sm btn-primary py-2 px-4 mt-3"
                                        style={{ fontSize: "16px" }}
                                        onClick={onHandleSubmitPictures}
                                    >
                                        Enregistrer
                                        {isLoading && (
                                            <div class="loader ml-4"></div>
                                        )}
                                    </button>
                                </figure>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function DeleteModal({
    deletedElement = null,
    onHandleDeleteOne,
    onHandleSelectedElement,
}) {
    return (
        <div
            className="modal fade"
            id="exampleModalgrid3"
            tabIndex="-1"
            aria-labelledby="exampleModalgridLabel3"
            aria-modal="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalgridLabel3">
                            Suppression
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <div className="row g-3">
                            <p>
                                Etes-vous sûr de vouloir effectuer la
                                suppression.
                            </p>
                            <div className="col-lg-12">
                                <div className="hstack gap-2 justify-content-end">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                        onClick={() =>
                                            onHandleSelectedElement(null)
                                        }
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        data-bs-dismiss="modal"
                                        onClick={() =>
                                            onHandleDeleteOne(deletedElement)
                                        }
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const handleImageChange = (file) => {
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            return reader.result;
        };
        reader.readAsDataURL(file);
    }
};

export default Banner;
