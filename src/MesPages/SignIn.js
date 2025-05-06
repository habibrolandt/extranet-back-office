import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { doSignInRequest } from "../services/apiService";
import { useNavigate } from "react-router-dom";
import { useUserData } from "../contexts/UserDataContext";

const schema = yup
    .object({
        STR_UTILOGIN: yup.string().required("Champs requis"),
        STR_UTIPASSWORD: yup.string().required("Champs requis"),
    })
    .required();

function SignIn() {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { handleSetUserData } = useUserData();
    const handleShow = () => {
        setShow((v) => !v);
    };

    const handleShowPassword = () => {
        setShowPassword((v) => !v);
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });
    const onSubmit = async (data) => {
        const params = {
            mode: "doConnexion",
            STR_UTILOGIN: data.STR_UTILOGIN,
            STR_UTIPASSWORD: data.STR_UTIPASSWORD,
            IS_ADMIN: "1",
            STR_SOCCODE: null,
        };
        try {
            const response = await doSignInRequest(params);
            if (response.data.code_statut === "1") {
                handleSetUserData(response.data);
                navigate("/tableau-de-bord");
            } else {
                handleShow();
            }
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div className="auth-page-wrapper auth-bg-cover py-5 d-flex justify-content-center align-items-center min-vh-100">
            <div className="bg-overlay" />
            {/* auth-page content */}
            <div className="auth-page-content overflow-hidden pt-lg-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card overflow-hidden border-0 custom-shadow-card">
                                <div className="row g-0">
                                    <div className="col-lg-6">
                                        <div className="p-lg-5 p-4  h-100">
                                            <div className="bg-overlay" />
                                            <div className="position-relative h-100 d-flex flex-column">
                                                <div className="mb-4">
                                                    <a
                                                        href="index.html"
                                                        className="d-block text-center"
                                                    >
                                                        <img
                                                            src="assets/images/logo-blanc.svg"
                                                            alt=""
                                                            height={88}
                                                        />
                                                    </a>
                                                </div>
                                                <div className="mb-2 text-center">
                                                    <h2
                                                        style={{
                                                            color: "#f9e71c",
                                                        }}
                                                    >
                                                        GROSSISTE VÉTÉRINAIRE
                                                    </h2>
                                                </div>
                                                <div className="mt-auto">
                                                    <div className=" text-center text-white pb-5">
                                                        <div className="">
                                                            <p className="fs-15 fst-italic">
                                                                En tant que
                                                                client
                                                                bénéficiez d'un
                                                                accompagnement
                                                                personnalisé,
                                                                commandez en
                                                                ligne, accédez à
                                                                des offres
                                                                préférentielles
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="animal-icons">
                                                        <img
                                                            src="assets/images/icone.png"
                                                            alt="Icon"
                                                            style={{
                                                                width: "100%",
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* end col */}
                                    <div className="col-lg-6">
                                        <div className="p-lg-5 p-4">
                                            <div>
                                                <h3
                                                    className=""
                                                    style={{ color: "#214293" }}
                                                >
                                                    Akwaba !
                                                </h3>
                                                <p className="text-muted">
                                                    Bonjour cher administrateur
                                                    !
                                                </p>
                                            </div>
                                            {show && (
                                                <div
                                                    className="alert alert-danger mb-xl-0"
                                                    role="alert"
                                                >
                                                    <strong>
                                                        {" "}
                                                        Mot de passe ou Nom
                                                        d'utilisateur incorrecte{" "}
                                                    </strong>{" "}
                                                    Contactez votre admistrateur
                                                </div>
                                            )}
                                            <div className="mt-4">
                                                <form
                                                    onSubmit={handleSubmit(
                                                        onSubmit
                                                    )}
                                                >
                                                    <div className="mb-3">
                                                        <label
                                                            htmlFor="STR_UTILOGIN"
                                                            className="form-label"
                                                        >
                                                            Nom d'utilisateur
                                                        </label>
                                                        <input
                                                            {...register(
                                                                "STR_UTILOGIN"
                                                            )}
                                                            id="STR_UTILOGIN"
                                                            className="form-control"
                                                            placeholder="Nom d'utilisateur"
                                                        />
                                                        <p className="text-danger">
                                                            {
                                                                errors
                                                                    .STR_UTILOGIN
                                                                    ?.message
                                                            }
                                                        </p>
                                                    </div>
                                                    <div className="mb-3">
                                                        <label
                                                            className="form-label"
                                                            htmlFor="password-input"
                                                        >
                                                            Mot de passe
                                                        </label>
                                                        <div className="position-relative auth-pass-inputgroup mb-3">
                                                            <input
                                                                {...register(
                                                                    "STR_UTIPASSWORD"
                                                                )}
                                                                placeholder="Mot de passe"
                                                                id="password-input"
                                                                className="form-control pe-5 password-input"
                                                                type={`${
                                                                    showPassword
                                                                        ? "text"
                                                                        : "password"
                                                                }`}
                                                            />
                                                            <p className="text-danger">
                                                                {
                                                                    errors
                                                                        .STR_UTIPASSWORD
                                                                        ?.message
                                                                }
                                                            </p>
                                                            <button
                                                                className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                                                                type="button"
                                                                id="password-addon"
                                                                onClick={
                                                                    handleShowPassword
                                                                }
                                                            >
                                                                <i
                                                                    className={`ri-eye-${
                                                                        showPassword
                                                                            ? "off-"
                                                                            : ""
                                                                    }fill align-middle`}
                                                                />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4">
                                                        <button
                                                            className="btn btn-success w-100"
                                                            type="submit"
                                                            style={{
                                                                backgroundColor:
                                                                    "#214293",
                                                            }}
                                                        >
                                                            Connexion
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    {/* end col */}
                                </div>
                                {/* end row */}
                            </div>
                            {/* end card */}
                        </div>
                        {/* end col */}
                    </div>
                    {/* end row */}
                </div>
                {/* end container */}
            </div>
        </div>
    );
}

export default SignIn;
