import * as yup from "yup";

export const ProfilCreationSchema = yup
    .object({
        STR_PRONAME: yup.string().required("Champs requis"),
        STR_PRODESCRIPTION: yup.string().required("Champs requis"),
        LG_LSTID: yup
            .object({
                value: yup.string().required("Sélection invalide"),
                label: yup.string().required("Sélection invalide"),
            })
            .required("Champs requis"),
    })
    .required();

export const UserCreationSchema = yup
    .object({
        STR_UTIFIRSTLASTNAME: yup.string().required("Champs requis"),
        STR_UTIPHONE: yup.string().required("Champs requis"),
        STR_UTIMAIL: yup
            .string()
            .email("Email invalide")
            .required("Champs requis"),
        STR_UTILOGIN: yup.string().required("Champs requis"),
        STR_UTIPASSWORD: yup.string().nullable(),
        STR_CONFIRMPASSWORD: yup
            .string()
            .oneOf(
                [yup.ref("STR_UTIPASSWORD"), null],
                "Les mots de passe doivent correspondre"
            ),

        LG_PROID: yup
            .object({
                value: yup.string().required("Sélection invalide"),
                label: yup.string().required("Sélection invalide"),
            })
            .required("Champs requis"),
        // STR_UTIPIC: yup
        //     .mixed()
        //     .test("required", "Vous devez fournir un fichier", (value) => {
        //         return value && value.length;
        //     })
        //     .test("fileSize", "Le fichier est trop lourd", (value, context) => {
        //         return value && value[0] && value[0].size <= 200000;
        //     })
        //     .test(
        //         "type",
        //         "Seul les jpeg et les png sont autorisés",
        //         function (value) {
        //             return (
        //                 value &&
        //                 value[0] &&
        //                 (value[0].type === "image/jpeg" ||
        //                     value[0].type === "image/png")
        //             );
        //         }
        //     ),
    })
    .required();

export const EditAdminInfosSchema = yup
    .object({
        STR_UTIFIRSTLASTNAME: yup.string().required("Champs requis"),
        STR_UTIPHONE: yup.string().required("Champs requis"),
        STR_UTIMAIL: yup
            .string()
            .email("Email invalide")
            .required("Champs requis"),
        STR_UTILOGIN: yup.string().required("Champs requis"),
        STR_UTIPASSWORD: yup.string().nullable(),
        STR_CONFIRMPASSWORD: yup
            .string()
            .oneOf(
                [yup.ref("STR_UTIPASSWORD"), null],
                "Les mots de passe doivent correspondre"
            ),
        // STR_UTIPIC: yup
        //     .mixed()
        //     .test("required", "Vous devez fournir un fichier", (value) => {
        //         return value && value.length;
        //     })
        //     .test("fileSize", "Le fichier est trop lourd", (value, context) => {
        //         return value && value[0] && value[0].size <= 200000;
        //     })
        //     .test(
        //         "type",
        //         "Seul les jpeg et les png sont autorisés",
        //         function (value) {
        //             return (
        //                 value &&
        //                 value[0] &&
        //                 (value[0].type === "image/jpeg" ||
        //                     value[0].type === "image/png")
        //             );
        //         }
        //     ),
    })
    .required();
