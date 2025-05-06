import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import {
    crudData,
    doRequest,
    endpoint,
    urlBaseImage,
} from "../services/apiService";
import { useEffect, useState } from "react";
import { hasPrivilege } from "../services/lib";
import usePrivilegesState from "../store/privilegesState";

export const detailsDemandeLoader = async ({ params }) => {
    let data = null;
    const requestParams = {
        mode: "getClientDemande",
        STR_UTITOKEN: "dfgfgsd",
        LG_SOCID: params.clientID,
    };
    try {
        const response = await doRequest(requestParams);
        data = response.data["demande"][0];
        console.log(data);
    } catch (error) {
        console.error(error);
    }
    return { data };
};

function DetailsDemande() {
    const privileges = usePrivilegesState((state) => state.privileges);
    const { data } = useLoaderData();
    const [currentData, setCurrentData] = useState(data);
    // console.log(currentData);
    const files = currentData?.gallery.split(",");
    const [decision, setDecision] = useState("");

    const navigate = useNavigate();
    useEffect(() => {
        const user = localStorage.getItem("user");

        if (!user) {
            navigate("/");
        }
    }, [navigate]);

    function handleNextTab(e) {
        e.preventDefault();
        const tabs = document.querySelectorAll(".my-step");
        const MyNavLink = document.querySelectorAll(".my-nav-link");

        let current = 0;

        tabs.forEach((tab, i) => {
            if (tab.classList.contains("show")) {
                tab.classList.remove("show", "active");
                current = i;
            }
        });
        tabs[current + 1].classList.add("show", "active");

        MyNavLink[current].setAttribute("aria-selected", "false");
        MyNavLink[current].setAttribute("data-position", "1");
        MyNavLink[current].setAttribute("tabIndex", "-1");
        MyNavLink[current].classList.remove("active");

        MyNavLink[current + 1].setAttribute("aria-selected", "true");
        MyNavLink[current + 1].setAttribute("data-position", "0");
        MyNavLink[current + 1].removeAttribute("tabIndex");
        MyNavLink[current + 1].classList.add("active");
    }

    function handlePreviousTab(e) {
        e.preventDefault();
        const tabs = document.querySelectorAll(".my-step");
        const MyNavLink = document.querySelectorAll(".my-nav-link");

        let current = 0;

        tabs.forEach((tab, i) => {
            if (tab.classList.contains("show")) {
                tab.classList.remove("show", "active");
                current = i;
            }
        });
        tabs[current - 1].classList.add("show", "active");

        MyNavLink[current].setAttribute("aria-selected", "false");
        MyNavLink[current].setAttribute("data-position", "1");
        MyNavLink[current].setAttribute("tabIndex", "-1");
        MyNavLink[current].classList.remove("active");

        MyNavLink[current - 1].setAttribute("aria-selected", "true");
        MyNavLink[current - 1].setAttribute("data-position", "0");
        MyNavLink[current - 1].removeAttribute("tabIndex");
        MyNavLink[current - 1].classList.add("active");
    }

    const handleAcceptRequest = async (clientID) => {
        const params = {
            mode: "createClientExternal",
            STR_UTITOKEN: "09ca8cb55dd4f20f5f2f",
            LG_SOCID: clientID,
        };
        let data = null;

        try {
            const resposne = await doRequest(params);
            data = resposne.data[0][0];

            setCurrentData(data);
            setDecision("MSG_VALIDATE_ACCOUNT_CREATION");
        } catch (error) {
            console.log(error);
        }
        console.log(data);
    };

    const handleRejectRequest = async (clientID) => {
        const params = {
            mode: "rejectRegistration",
            STR_UTITOKEN: "09ca8cb55dd4f20f5f2f",
            LG_SOCID: clientID,
        };
        let data = null;

        try {
            const resposne = await doRequest(params);
            data = resposne.data[0][0];

            setCurrentData(data);
            setDecision("MSG_REJECT_ACCOUNT_CREATION");
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (decision !== "" && decision !== undefined && decision !== null) {
            const params = {
                mode: "sendEmail",
                LG_LSTID: decision,
                TO: data.str_socmail,
            };
            try {
                const response = crudData(
                    params,
                    endpoint.configurationManagerEndpoint
                );
                if (response.data.code_statut !== "1") {
                    console.error(response.data.desc_statut);
                }
            } catch (error) {
                console.log(error);
            }
        }
    }, [decision]);

    return (
        <form className="vertical-navs-step">
            <div className="row gy-5">
                <div className="col-lg-4">
                    <CustomNav />
                    {/* end nav */}
                </div>{" "}
                {/* end col*/}
                <div className="col-lg-8">
                    <div className="px-lg-4">
                        <div className="tab-content">
                            <div
                                className="tab-pane fade my-step show active"
                                id="v-pills-bill-info"
                                role="tabpanel"
                                ariaPledby="v-pills-bill-info-tab"
                            >
                                <div>
                                    <h5>Information du gérant</h5>
                                </div>
                                <div>
                                    <div className="row g-3">
                                        <div className="col-sm-6">
                                            <p
                                                htmlFor="firstName"
                                                className="inline-block mb-2 fw-medium"
                                            >
                                                Nom et prénoms
                                            </p>
                                            <p className="text-muted">
                                                {
                                                    currentData.str_utifirstlastname
                                                }
                                            </p>
                                        </div>
                                        <div className="col-sm-6">
                                            <p
                                                htmlFor="lastName"
                                                className="inline-block mb-2 fw-medium"
                                            >
                                                Adresse email
                                            </p>
                                            <p className="text-muted">
                                                {currentData.str_utimail}
                                            </p>
                                        </div>
                                        <div className="col-sm-6">
                                            <p
                                                htmlFor="username"
                                                className="inline-block mb-2 fw-medium"
                                            >
                                                Contact
                                            </p>
                                            <p className="text-muted">
                                                {currentData.str_utiphone}
                                            </p>
                                        </div>
                                        <div className="col-sm-6">
                                            <p
                                                htmlFor="email"
                                                className="inline-block mb-2 fw-medium"
                                            >
                                                Username{" "}
                                            </p>
                                            <p className="text-muted">
                                                {currentData.str_utilogin}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex align-items-start gap-3 mt-4">
                                    <button
                                        onClick={(e) => handleNextTab(e)}
                                        type="button"
                                        className="btn btn-success btn-p right ms-auto nexttab nexttab"
                                        data-nexttab="v-pills-bill-address-tab"
                                    >
                                        <i className="ri-arrow-right-line p-icon align-middle fs-16 ms-2" />
                                        Infos de la société
                                    </button>
                                </div>
                            </div>
                            {/* end tab pane */}
                            <div
                                className="tab-pane fade my-step"
                                id="v-pills-bill-address"
                                role="tabpanel"
                                ariaPledby="v-pills-bill-address-tab"
                            >
                                <div>
                                    <h5>Information de la société</h5>
                                </div>
                                <div>
                                    <div className="row g-3">
                                        <div className="col-sm-6">
                                            <p
                                                htmlFor="address"
                                                className="inline-block mb-2 fw-medium"
                                            >
                                                Libéllé
                                            </p>
                                            <p className="text-muted">
                                                {currentData.str_socname}
                                            </p>
                                        </div>
                                        {currentData.lg_socextid && (
                                            <div className="col-sm-6">
                                                <p
                                                    htmlFor="zip"
                                                    className="inline-block mb-2 fw-medium"
                                                >
                                                    Identifiant 8sens
                                                </p>
                                                <p className="text-muted">
                                                    {currentData.lg_socextid}
                                                </p>
                                            </div>
                                        )}
                                        <div className="col-sm-6">
                                            <p
                                                htmlFor="zip"
                                                className="inline-block mb-2 fw-medium"
                                            >
                                                Type société
                                            </p>
                                            <p className="text-muted">
                                                {currentData.str_typesociete}
                                            </p>
                                        </div>
                                        <div className="col-sm-6">
                                            <p
                                                htmlFor="address2"
                                                className="inline-block mb-2 fw-medium"
                                            >
                                                Siret(NCC){" "}
                                            </p>
                                            <p className="text-muted">
                                                {currentData.str_socsiret}
                                            </p>
                                        </div>
                                        <div className="col-sm-6">
                                            <p
                                                htmlFor="country"
                                                className="inline-block mb-2 fw-medium"
                                            >
                                                Code NAF(Régime fiscal)
                                            </p>
                                            <p className="text-muted">
                                                {currentData.str_soccode}
                                            </p>
                                        </div>
                                        <div className="col-sm-6">
                                            <p
                                                htmlFor="state"
                                                className="inline-block mb-2 fw-medium"
                                            >
                                                Pays de facturation
                                            </p>
                                            <p className="text-muted">
                                                {
                                                    currentData.str_paysfacturation
                                                }
                                            </p>
                                        </div>
                                        <div className="col-sm-6">
                                            <p className="inline-block mb-2 fw-medium">
                                                Téléphone société
                                            </p>
                                            <p className="text-muted">
                                                {currentData.str_socphone}
                                            </p>
                                        </div>
                                        <div className="col-sm-6">
                                            <p className="inline-block mb-2 fw-medium">
                                                Adresse E-mail
                                            </p>
                                            <p className="text-muted">
                                                {currentData.str_socmail}
                                            </p>
                                        </div>

                                        <div className="col-12">
                                            <p className="inline-block mb-2 fw-medium">
                                                Commentaire
                                            </p>
                                            <p className="text-muted">
                                                {currentData.str_socdescription}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex align-items-start gap-3 mt-4">
                                    <button
                                        onClick={(e) => handlePreviousTab(e)}
                                        type="button"
                                        className="btn btn-light btn-p previestab"
                                        data-previous="v-pills-bill-info-tab"
                                    >
                                        <i className="ri-arrow-left-line p-icon align-middle fs-16 me-2" />{" "}
                                        Revenir aux infos du gérant
                                    </button>
                                    <button
                                        onClick={(e) => handleNextTab(e)}
                                        type="button"
                                        className="btn btn-success btn-p right ms-auto nexttab nexttab"
                                        data-nexttab="v-pills-payment-tab"
                                    >
                                        <i className="ri-arrow-right-line p-icon align-middle fs-16 ms-2" />
                                        Pièces jointes
                                    </button>
                                </div>
                            </div>
                            {/* end tab pane */}
                            <div
                                className="tab-pane fade my-step"
                                id="v-pills-payment"
                                role="tabpanel"
                                ariaPledby="v-pills-payment-tab"
                            >
                                <div>
                                    <h5>Pièces jointes</h5>
                                </div>
                                <div>
                                    <div className="row gy-3">
                                        {files.map((file, index) => {
                                            return (
                                                <CardImage
                                                    path={file}
                                                    key={index}
                                                    lg_socid={
                                                        currentData.lg_socid
                                                    }
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="d-flex align-items-start gap-3 mt-4">
                                    <button
                                        onClick={(e) => handlePreviousTab(e)}
                                        type="button"
                                        className="btn btn-light btn-p previestab"
                                        data-previous="v-pills-bill-address-tab"
                                    >
                                        <i className="ri-arrow-left-line p-icon align-middle fs-16 me-2" />{" "}
                                        Retour aux infos de la société
                                    </button>
                                    <button
                                        onClick={(e) => handleNextTab(e)}
                                        type="button"
                                        className="btn btn-success btn-p right ms-auto nexttab nexttab"
                                        data-nexttab="v-pills-finish-tab"
                                    >
                                        <i className="ri-arrow-right-line p-icon align-middle fs-16 ms-2" />{" "}
                                        Décision
                                    </button>
                                </div>
                            </div>
                            {/* end tab pane */}
                            <div
                                className="tab-pane fade my-step"
                                id="v-pills-finish"
                                role="tabpanel"
                                ariaPledby="v-pills-finish-tab"
                            >
                                <div className="text-center pt-4 pb-2">
                                    <>
                                        <h5>
                                            Demande d'inscription du client:
                                        </h5>

                                        {currentData.str_socstatut ===
                                        "process" ? (
                                            <div className="col-12 d-flex justify-content-between align-items-center mt-4">
                                                <button
                                                    onClick={() =>
                                                        handleRejectRequest(
                                                            currentData.lg_socid
                                                        )
                                                    }
                                                    type="button"
                                                    className="btn btn-danger btn-lg waves-effect waves-light"
                                                >
                                                    Refuser
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleAcceptRequest(
                                                            currentData.lg_socid
                                                        )
                                                    }
                                                    type="button"
                                                    className="btn btn-success btn-lg waves-effect waves-light"
                                                >
                                                    Accepter
                                                </button>
                                            </div>
                                        ) : currentData.str_socstatut ===
                                          "enable" ? (
                                            <p className="text-muted text-center">
                                                Demande validé
                                            </p>
                                        ) : (
                                            <p className="text-muted text-center">
                                                Demande refusé
                                            </p>
                                        )}
                                    </>
                                </div>
                            </div>
                            {/* end tab pane */}
                        </div>
                        {/* end tab content */}
                    </div>
                </div>
                {/* end col */}
            </div>
            {/* end row */}
        </form>
    );
}

function CustomNav({ inProcess }) {
    return (
        <div
            className="nav flex-column custom-nav nav-pills"
            role="tablist"
            aria-orientation="vertical"
        >
            <button
                className="nav-link my-nav-link active"
                id="v-pills-bill-info-tab"
                data-bs-toggle="pill"
                data-bs-target="#v-pills-bill-info"
                type="button"
                role="tab"
                aria-controls="v-pills-bill-info"
                aria-selected="false"
                data-position={0}
                tabIndex={-1}
            >
                <span className="step-title me-2">Etape 1</span>
                Informations du gérant
            </button>
            <button
                className="nav-link my-nav-link"
                id="v-pills-bill-address-tab"
                data-bs-toggle="pill"
                data-bs-target="#v-pills-bill-address"
                type="button"
                role="tab"
                aria-controls="v-pills-bill-address"
                aria-selected="false"
                data-position={1}
            >
                <span className="step-title me-2">Etape 2</span>
                Informations de la société
            </button>
            <button
                className="nav-link my-nav-link"
                id="v-pills-payment-tab"
                data-bs-toggle="pill"
                data-bs-target="#v-pills-payment"
                type="button"
                role="tab"
                aria-controls="v-pills-payment"
                aria-selected="false"
                data-position={2}
                tabIndex={-1}
            >
                <span className="step-title me-2">Etape 3</span>
                Pièces jointes
            </button>
            <button
                className="nav-link my-nav-link"
                id="v-pills-finish-tab"
                data-bs-toggle="pill"
                data-bs-target="#v-pills-finish"
                type="button"
                role="tab"
                aria-controls="v-pills-finish"
                aria-selected="false"
                data-position={3}
                tabIndex={-1}
            >
                <span className="step-title me-2">Etape 4</span>
                Décison
            </button>
        </div>
    );
}

function CardImage({ path, lg_socid }) {
    const [title, imgHref] = path.split(":");

    let content = "";
    if (imgHref.includes("pdf")) {
        content = <img src="/images/pdf.png" alt="" />;
    } else {
        content = (
            <img
                className="figure-img img-fluid rounded"
                src={`${urlBaseImage}/images/documents/${lg_socid}/${imgHref}`}
                alt={title}
            />
        );
    }

    return (
        <div className="col-sm-6">
            <p className="inline-block mb-2 fw-medium">{title}</p>
            {content}
        </div>
    );
}
export default DetailsDemande;
