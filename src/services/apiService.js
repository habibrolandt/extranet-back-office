import axios from "axios";

const getRootUrl = (port) => {
    const originWithoutPort =
        window.location.protocol + "//" + window.location.hostname;
    const defaultPort = "80";
    const baseUrl = "/eticketbackend/backoffice/webservices/";
    //const baseUrl = "/backoffice/webservices/";
    // const baseUrl = "/webservices/";
    const finalPort = port ? port : defaultPort;
    return `http://192.168.1.4:${finalPort}/`;
    //return `${originWithoutPort}:${finalPort}${baseUrl}`;
};

const getFullUrl = () => {
    const { protocol, hostname, port } = window.location;
    const portPart = port ? `:${port}` : "";
    // return `${protocol}//${hostname}:8888/`;
    return `${protocol}//${hostname}/`;
};

export const fullUrl = getFullUrl();

// +++++++++++++++ FONCTION +++++++++++++++++++

// export const urlBaseImage = "http://192.168.1.16/extranetbackend/backoffice/";
export const urlBaseImage = `${fullUrl}/extranetbackend/backoffice/`;

export const urlBaseImage2 = fullUrl + urlBaseImage; //alert(fullUrl+urlBaseImage); backoffice
export const rootUrl = fullUrl + "extranetbackend/backoffice/webservices/"; //Production //eticketbackend/
localStorage.setItem("urlBaseImage", fullUrl + urlBaseImage);

const fetchEvenements = (params) => {
    return axios.post(`${rootUrl}TicketManager.php`, params, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
};

// Vous pouvez ajouter d'autres fonctions pour d'autres appels API ici
// Par exemple, une fonction pour obtenir les détails d'un événement
const fetchEvenementDetails = (eventId) => {
    const params = {
        mode: "getEvenementDetails",
        LG_EVENID: eventId,
        //STR_UTITOKEN: 'wzpjku2dvokriz3phgop',
    };

    return axios.post(`${rootUrl}TicketManager.php`, params, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
};

const doConnexion = (params) => {
    return axios.post(`${rootUrl}CustomerManager.php`, params, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
};

const doDisConnexion = (params) => {
    return axios.post(`${rootUrl}Authentification.php`, params, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
};

const crudData = (params, apiUrl, multiFormData = false) => {
    let headers = {
        "Content-Type": "application/x-www-form-urlencoded",
    };
    if (multiFormData) {
        headers = {
            "Content-Type": "multipart/form-data",
        };
    }
    return axios.post(`${rootUrl}${apiUrl}`, params, {
        headers: headers,
    });
};

export const doRequest = (params, apiUrl = "ConfigurationManager.php") => {
    const formData = new FormData();
    for (const key in params) {
        if (Array.isArray(params[key])) {
            formData.append(key, JSON.stringify(params[key])); // Convertir les listes en chaînes JSON
        } else {
            formData.append(key, params[key]);
        }
    }

    return axios.post(`${rootUrl}${apiUrl}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const doSignInRequest = (params) => {
    const formData = new FormData();
    for (const key in params) {
        formData.append(key, params[key]);
    }

    return axios.post(`${rootUrl}Authentification.php`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

const currentYear = new Date().getFullYear(); // Obtenir l'année en cours
const firstDayOfYear = new Date(currentYear, 0, 1); // 1er janvier de l'année en cours
const today = new Date(); // Date du jour

// Formater les dates en 'YYYY-MM-DD' (en retirant la partie heure)
const formatDate = (date) => date.toISOString().split("T")[0];

// Obtenir la date du dernier jour du mois prochain

const nextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0); // Obtenir le dernier jour du mois prochain
// on peut changer le nombre de mois (2)

// Stocker dans le localStorage
localStorage.setItem("DT_BEGIN", formatDate(firstDayOfYear));
localStorage.setItem("today", formatDate(today));

const date = {
    firstDayOfYear: formatDate(firstDayOfYear),
    // today: formatDate(today),
    today: formatDate(nextMonth),
};

export const mode = {
    listBanniereMode: "listBanniere",
    listEvenementFrontMode: "listEvenementFront",
    getEvenementMode: "getEvenement",
    createTicketMode: "createTicket",
    verifypaymentMode: "verifypayment",
    listNewsEvenementMode: "listNewsEvenement",
    listCategorieplaceEvenementMode: "listCategorieplaceEvenement",
    listDocumentsMode: "listDocuments",
    deleteDocumentMode: "deleteProductImage",
    uploadOneOrSeveralDocumentsMode: "uploadOneOrSeveralDocuments",
    changeDocumentStatutMode: "changeDocumentStatut",
    getClientDemandesMode: "getClientDemandes",
    getDeliveryPlacesMode: "getDeliveryPlace",
};

export const endpoint = {
    configurationManagerEndpoint: "ConfigurationManager.php",
};

localStorage.setItem("appMode", JSON.stringify(mode));
localStorage.setItem("appDate", JSON.stringify(date));
localStorage.setItem("appDevise", "GNF");

export {
    fetchEvenements,
    fetchEvenementDetails,
    doConnexion,
    doDisConnexion,
    crudData,
};

export const parameterStatutEnable = "enable";
export const parameterAgenceSocietyID = "1";
