import React, { useEffect, useState } from "react";
import { crudData } from "../services/apiService";
import { useNavigate, useParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import "../App.css";
import Select from "react-select";
import { toast } from "react-toastify";
import useProductStore from "../store/productState";
import ImageCard from "../Mescomposants/ImageCard/ImageCard";
import { acceptedImageTypes, formatPrice } from "../services/lib";
import ButtonAddPicture from "../Mescomposants/Button/ButtonAddPicture";

function Product() {
    // const { productData } = useLoaderData();
    const {
        state,
        fetchProduct,
        fetchProductSubsitutions,
        addProductSubstitutions,
        deleteProductSubstitution,
    } = useProductStore();
    const { product: productData, productSubsitutions, loading, error } = state;
    const { productID } = useParams();
    const [listSubstitutionProducts, setListSubstitutionProducts] = useState(
        []
    );
    const [isLoading, setIsLoading] = useState(false);

    const [errorMessage, setErrorMessage] = useState({
        mainImage: "",
        thumbnails: "",
        substitutionProducts: "",
    });
    const [options, setOptions] = useState([]);
    const [productSelectData, setProductSelectData] = useState([]);
    let currentUser = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const [show, setShow] = useState({
        showError: false,
        showSuccess: false,
    });

    useEffect(() => {
        fetchProduct(productID); // Récupérer le produit avec l'ID '123'
    }, [fetchProduct, productID]);

    useEffect(() => {
        const user = localStorage.getItem("user");

        if (!user) {
            navigate("/");
        }
    }, [navigate]);

    const handleProductSelectChange = (selected) => {
        setProductSelectData(selected);
    };

    useEffect(() => {
        if (productData != null) {
            const fetchListOfSubstitutionProducts = async () => {
                const payload = new FormData();

                payload.append("mode", "listProduct");
                payload.append("LIMIT", 900);
                payload.append("PAGE", 1);

                try {
                    const response = await crudData(
                        payload,
                        "StockManager.php"
                    );
                    // if (response.data.code_statut === "1") {
                    setListSubstitutionProducts(response.data.products);
                    // }
                } catch (error) {
                    console.log("error", error.message);
                    toast.error(
                        "Impossible de recupéré les donnéres des produits de substitution. Veuillez reessayez plus tard"
                    );
                }
            };

            fetchListOfSubstitutionProducts();
        }
    }, [productData]);

    useEffect(() => {
        if (listSubstitutionProducts.length > 0) {
            fetchProductSubsitutions(productID);
        }
    }, [listSubstitutionProducts, fetchProductSubsitutions, productID]);

    useEffect(() => {
        if (listSubstitutionProducts != null && productSubsitutions) {
            const affiliatedProductIds = productSubsitutions.map(
                (product) => product.ArtID
            );

            const filteredProducts = listSubstitutionProducts.filter(
                (product) => {
                    // Exclure le produit lui-même
                    if (product.ArtID === productID) {
                        return false;
                    }

                    if (affiliatedProductIds.includes(product.ArtID)) {
                        return false;
                    }

                    return true;
                }
            );

            const opt = filteredProducts.map((product) => {
                return {
                    value: product.ArtID,
                    label: product.ArtLib,
                };
            });

            setOptions(opt);
        }
    }, [listSubstitutionProducts, productSubsitutions, productID]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleAddProductSubstitutions = () => {
        setIsLoading(true);
        addProductSubstitutions(productID, productSelectData);
        setIsLoading(false);
        setProductSelectData([]);
        if (!error) {
            toast.success("Produits de substituton ajoutées avec succès");
        }
    };

    const handleDeleteProductSubstitution = (lg_prosubid) => {
        deleteProductSubstitution(lg_prosubid);
        if (!error) {
            toast.success("Produit de substituton retiré avec succès");
        }
    };

    return (
        <>
            <h1>Produit #{productID}</h1>
            <div className="row justify-content-center">
                <ImageProductComponent productID={productID} />
                <div className="col-xxl-8">
                    <div className="card">
                        <form>
                            <div className="row">
                                {show.showError && (
                                    <div
                                        className="alert alert-danger mb-xl-0"
                                        role="alert"
                                    >
                                        <strong>
                                            {" "}
                                            Erreur cette action ne s'est pas
                                            passer correctement.{" "}
                                        </strong>{" "}
                                        Veuillez contactez votre admistrateur
                                    </div>
                                )}

                                {show.showSuccess && (
                                    <div
                                        className="alert alert-success"
                                        role="alert"
                                    >
                                        <strong> Opération réussi !!</strong>
                                    </div>
                                )}
                            </div>
                            <div
                                className="card-body p-4"
                                style={{ minHeight: 608 }}
                            >
                                <h4 className="mb-4 text-decoration-underline">
                                    Informations du produit
                                </h4>
                                <div className="row g-3">
                                    <div className="col-sm-12">
                                        <label
                                            htmlFor="str_proname"
                                            className="form-label"
                                        >
                                            Nom du produit
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="str_proname"
                                            disabled
                                            defaultValue={productData?.ArtLib}
                                        />
                                    </div>
                                    <div className="col-sm-12">
                                        <label
                                            htmlFor="str_prodescription"
                                            className="form-label"
                                        >
                                            Description
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="str_prodescription"
                                            defaultValue={productData?.CmtTxt}
                                            disabled
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label
                                            htmlFor="art_categorie"
                                            className="form-label"
                                        >
                                            Categorie{" "}
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="art_categorie"
                                            defaultValue={productData?.ArtCateg}
                                            disabled
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label
                                            htmlFor="art_gamme"
                                            className="form-label"
                                        >
                                            Gamme{" "}
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="art_gamme"
                                            defaultValue={productData?.ArtGamme}
                                            disabled
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label
                                            htmlFor="art_species"
                                            className="form-label"
                                        >
                                            Espèces{" "}
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="art_species"
                                            defaultValue={
                                                productData?.ArtSpecies
                                            }
                                            disabled
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label
                                            htmlFor="int_propriceachat"
                                            className="form-label"
                                        >
                                            Prix d'achat{" "}
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="int_propriceachat"
                                            defaultValue={
                                                productData &&
                                                formatPrice(
                                                    productData?.ArtPrixBase
                                                ) + " FCFA"
                                            }
                                            disabled
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label
                                            htmlFor="int_propricevente"
                                            className="form-label"
                                        >
                                            Prix de vente{" "}
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="int_propricevente"
                                            defaultValue={
                                                productData &&
                                                formatPrice(
                                                    productData.ArtLastPA
                                                ) + " FCFA"
                                            }
                                            disabled
                                        />
                                    </div>
                                    {productSubsitutions &&
                                        productSubsitutions.length > 0 && (
                                            <div className="col-md-12">
                                                <label
                                                    htmlFor="int_propricevente"
                                                    className="form-label"
                                                >
                                                    Produits de subsitution{" "}
                                                </label>
                                                <div>
                                                    {productSubsitutions &&
                                                        productSubsitutions.map(
                                                            (
                                                                substitution,
                                                                index
                                                            ) => (
                                                                <span
                                                                    key={index}
                                                                    className="badge bg-primary m-1 p-2"
                                                                >
                                                                    {
                                                                        substitution.ArtLib
                                                                    }
                                                                    <span
                                                                        style={{
                                                                            cursor: "pointer",
                                                                            marginLeft:
                                                                                "10px",
                                                                        }}
                                                                        onClick={() =>
                                                                            handleDeleteProductSubstitution(
                                                                                substitution.lg_prosubid
                                                                            )
                                                                        }
                                                                    >
                                                                        &times;
                                                                    </span>
                                                                </span>
                                                            )
                                                        )}
                                                </div>
                                            </div>
                                        )}

                                    <div className="col-md-12 p-2">
                                        <label
                                            className=""
                                            htmlFor="substitution-products"
                                        >
                                            Choisir des produits de
                                            subsititution:
                                        </label>
                                        {listSubstitutionProducts && (
                                            <Select
                                                isMulti
                                                name="colors"
                                                options={options}
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                onChange={
                                                    handleProductSelectChange
                                                }
                                                value={productSelectData}
                                                placeholder="Choisir des produits de subsititution"
                                            />
                                        )}
                                        {errorMessage.substitutionProducts && (
                                            <p
                                                style={{
                                                    color: "red",
                                                }}
                                                className="m-0 p-0"
                                            >
                                                {
                                                    errorMessage.substitutionProducts
                                                }
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="hstack gap-2 justify-content-end d-print-none mt-4">
                                    {/*<button
                                        type="button"
                                        onClick={handleGoBack}
                                        className="btn btn-primary"
                                    >
                                        Annuler
                                    </button>*/}
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleAddProductSubstitutions}
                                        disabled={
                                            productSelectData.length === 0
                                        }
                                    >
                                        <i className="ri-send-plane-fill align-bottom me-1" />{" "}
                                        Enregistrer
                                        {isLoading && (
                                            <div className="loader ml-4"></div>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                {/*end col*/}
            </div>
        </>
    );
}

const ImageProductComponent = ({ productID }) => {
    const {
        state,
        fetchProductPictures,
        addProductMainPicture,
        addProductThumbsPictures,
        deleteProductMainPicture,
        deleteProductThumbsPicture,
    } = useProductStore();
    const { productPictures, loading } = state;
    const [main, setMain] = useState(null);
    const [thumbs, setThumbs] = useState([]);
    const [thumbsUpload, setThumbsUpload] = useState([]);
    const [thumbsPreview, setThumbsPreview] = useState([]);
    const [mainUpload, setMainUpload] = useState(null);
    const [mainPreview, setMainPreview] = useState(null);

    useEffect(() => {
        if (productPictures) {
            setMain(
                productPictures?.find((picture) => picture.isMain === true)
            );
            setThumbs(
                productPictures?.filter((picture) => picture.isMain === false)
            );
        }
    }, [productPictures]);

    const resetUploadBanner = () => {
        setThumbsUpload([]);
        setThumbsPreview([]);
    };

    const handleAddMainPreview = (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setMainPreview((prev) => reader.result);
            };
            reader.readAsDataURL(file);
        }

        setMainUpload((prev) => file);
    };

    const handleRemoveMainPreview = () => {
        setMainUpload(null);
        setMainPreview(null);
    };

    const handleAddPreviewThumb = (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbsPreview([...thumbsPreview, reader.result]);
            };
            reader.readAsDataURL(file);
        }

        const oldPicturesUpload = [...thumbsUpload];
        console.log([...oldPicturesUpload, file]);
        setThumbsUpload([...oldPicturesUpload, file]);
    };

    const handleRemovePreviewThumb = (e, index) => {
        if (index >= 0 && index < thumbsUpload.length) {
            setThumbsUpload((picturesUpload) =>
                picturesUpload.filter((item, i) => index !== i)
            );
            setThumbsPreview((previewPictures) =>
                previewPictures.filter((item, i) => index !== i)
            );
        } else {
            console.error("Index out of bounds");
        }
    };

    const submitProductMainImage = () => {
        addProductMainPicture(mainUpload, productID);
    };

    const submitProductThumbsPictures = () => {
        addProductThumbsPictures(thumbsUpload, productID);
    };
    useEffect(() => {
        fetchProductPictures(productID); // Récupérer le produit avec l'ID '123'
    }, [fetchProductPictures, productID]);

    return (
        <>
            <div className="col-xxl-4">
                <div className="card">
                    <div className="card-body  p-4" style={{ minHeight: 608 }}>
                        <h4 className="mb-4 text-decoration-underline">
                            Images du produit
                        </h4>
                        <div className="mb-4">
                            <div className="d-flex justify-content-between">
                                <h5>Image principale</h5>
                            </div>
                            <div className="d-flex gap-2">
                                {!main && (
                                    <ButtonAddPicture
                                        modalId={"exampleModalgrid3"}
                                    />
                                )}
                                {main && (
                                    <ImageCard
                                        image={main}
                                        onDelete={() =>
                                            deleteProductMainPicture(main.id)
                                        }
                                    />
                                )}
                            </div>
                        </div>
                        <div>
                            <ModalThumbs
                                onHandleAddPreviewPicture={
                                    handleAddPreviewThumb
                                }
                                picturesUpload={thumbsUpload}
                                previewPictures={thumbsPreview}
                                onHandleRemovePreviewPicture={
                                    handleRemovePreviewThumb
                                }
                                onHandleSubmitPictures={
                                    submitProductThumbsPictures
                                }
                                isLoading={loading}
                            />
                            <ModalMain
                                onHandleAddPreviewPicture={handleAddMainPreview}
                                onHandleRemovePreviewPicture={
                                    handleRemoveMainPreview
                                }
                                pictureUpload={mainUpload}
                                previewPicture={mainPreview}
                                onHandleSubmitPicture={submitProductMainImage}
                                isLoading={loading}
                            />
                            <div className="d-flex justify-content-between">
                                <h5>Image secondaires</h5>
                            </div>

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
                                <div className="d-flex gap-4">
                                    <ButtonAddPicture
                                        modalId={"exampleModalgrid2"}
                                        customSize={{
                                            width: 223.333,
                                            height: 223.333,
                                        }}
                                    />
                                    {thumbs.length > 0 &&
                                        thumbs.map((thumb) => (
                                            <ImageCard
                                                key={thumb.id}
                                                image={thumb}
                                                onDelete={() =>
                                                    deleteProductThumbsPicture(
                                                        thumb.id
                                                    )
                                                }
                                            />
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

function ModalThumbs({
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
            <div className="modal-dialog" style={{ maxWidth: "700px" }}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalgridLabel2">
                            Ajouter image secondaire
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
                                    {picturesUpload.map((picture, index) => (
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
                                                                {picture.name}
                                                            </h5>
                                                            <p
                                                                className="fs-13 text-muted mb-0"
                                                                data-dz-size=""
                                                            >
                                                                <strong>
                                                                    {(
                                                                        picture.size /
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
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                    >
                                        Enregistrer
                                        {isLoading && (
                                            <div className="loader ml-4"></div>
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

function ModalMain({
    onHandleAddPreviewPicture,
    pictureUpload,
    previewPicture,
    onHandleRemovePreviewPicture,
    onHandleSubmitPicture,
    isLoading,
}) {
    return (
        <div
            className="modal fade"
            id="exampleModalgrid3"
            tabIndex="-1"
            aria-labelledby="exampleModalgridLabel3"
            aria-modal="true"
        >
            <div className="modal-dialog" style={{ maxWidth: "700px" }}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalgridLabel3">
                            Ajouter image principale
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

                        {pictureUpload && (
                            <div className="border rounded">
                                <div className="d-flex p-2">
                                    <div className="flex-shrink-0 me-3">
                                        <div className="avatar-sm bg-light rounded">
                                            <img
                                                src={previewPicture}
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
                                                {pictureUpload?.name}
                                            </h5>
                                            <p
                                                className="fs-13 text-muted mb-0"
                                                data-dz-size=""
                                            >
                                                <strong>
                                                    {(
                                                        pictureUpload?.size /
                                                        (1024 * 1024)
                                                    ).toFixed(2)}
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
                                            onClick={(e) =>
                                                onHandleRemovePreviewPicture()
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
                        )}

                        <figure className="text-end" style={{ margin: 0 }}>
                            <button
                                className="d-flex align-items-center justify-content-center btn btn-sm btn-primary py-2 px-4 mt-3"
                                style={{ fontSize: "16px" }}
                                onClick={onHandleSubmitPicture}
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                Enregistrer
                                {isLoading && (
                                    <div className="loader ml-4"></div>
                                )}
                            </button>
                        </figure>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Product;
