import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { urlBaseImage } from "../services/apiService";
import { useNavigate, useParams } from "react-router-dom";
import { UserCreationSchema } from "../services/formSchema";
import {
    createUser,
    fetchSystemProfils,
    fetchUserData,
    updateUser,
} from "../api/User";
import AsyncSelect from "react-select/async";

function CreateOrEditUser() {
    const navigate = useNavigate();
    const { ID } = useParams();
    const [editingUser, setEditingUser] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    let currentUser = JSON.parse(localStorage.getItem("user"));

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(UserCreationSchema),
    });

    const onSubmit = async (data) => {
        if (ID) {
            let currentData = data;

            if (
                data.STR_UTIPASSWORD === editingUser.STR_UTIPASSWORD ||
                (data.STR_CONFIRMPASSWORD === "" && data.STR_UTIPASSWORD === "")
            ) {
                delete currentData.STR_CONFIRMPASSWORD;
                delete currentData.STR_UTIPASSWORD;
            } else {
                delete currentData.STR_CONFIRMPASSWORD;
            }
            console.log(currentData);
            currentData.LG_PROID = currentData.LG_PROID.value;
            currentData = { ...currentData, LG_UTIID: ID };
            let result = updateUser(currentData);
            if (result) {
                reset({
                    STR_UTIFIRSTLASTNAME: data.STR_UTIFIRSTLASTNAME,
                    STR_UTIPHONE: data.STR_UTIPHONE,
                    STR_UTILOGIN: data.STR_UTILOGIN,
                    STR_UTIMAIL: data.STR_UTIMAIL,
                    STR_UTIPASSWORD: data.STR_UTIPASSWORD,
                    LG_PROID: data.LG_PROID,
                });
                navigate(-1);
            }
        } else {
            data.LG_PROID = data.LG_PROID.value;
            let result = createUser(data);
            if (result) {
                navigate(-1);
            }
        }
    };

    useEffect(() => {
        if (ID) {
            const currentUser = fetchUserData(ID);
            currentUser.then((data) => {
                setEditingUser(data);
                reset({
                    STR_UTIFIRSTLASTNAME: data.STR_UTIFIRSTLASTNAME,
                    STR_UTIPHONE: data.STR_UTIPHONE,
                    STR_UTIMAIL: data.STR_UTIMAIL,
                    STR_UTILOGIN: data.STR_UTILOGIN,
                    STR_UTIPIC: data.STR_UTIPIC
                        ? `${urlBaseImage}images/avatars/${data.LG_UTIID}/${data.STR_UTIPIC}`
                        : null,
                    LG_UTIID: data.LG_UTIID,
                    LG_PROID: {
                        label: data.STR_PRODESCRIPTION,
                        value: data.LG_PROID,
                    },
                });
            });
        }
    }, [ID, currentUser.STR_UTITOKEN, reset]);

    return (
        <div className="row justify-content-center">
            <h1>
                {ID ? "Modification" : "Création"} utilisateur{" "}
                {ID && "#" + editingUser?.LG_UTIID}
            </h1>
            <div className="col-xxl-12">
                <div className="card">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="card-body p-4">
                            <div className="row g-3">
                                <div className="col-sm-12">
                                    <label
                                        htmlFor="STR_UTIFIRSTLASTNAME"
                                        className="form-label"
                                    >
                                        Nom et prénoms
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="STR_UTIFIRSTLASTNAME"
                                        placeholder="Nom et prénoms"
                                        {...register("STR_UTIFIRSTLASTNAME")}
                                    />
                                    <p className="text-danger">
                                        {errors.STR_UTIFIRSTLASTNAME?.message}
                                    </p>
                                </div>
                                <div className="col-sm-6">
                                    <label
                                        htmlFor="STR_UTILOGIN"
                                        className="form-label"
                                    >
                                        Nom d'utilisateur
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="STR_UTILOGIN"
                                        placeholder="Nom d'utilisateur"
                                        {...register("STR_UTILOGIN")}
                                    />
                                    <p className="text-danger">
                                        {errors.STR_UTILOGIN?.message}
                                    </p>
                                </div>

                                <div className="col-md-6">
                                    <label
                                        htmlFor="STR_UTIMAIL"
                                        className="form-label"
                                    >
                                        Email{" "}
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="STR_UTIMAIL"
                                        placeholder="Email"
                                        {...register("STR_UTIMAIL")}
                                    />
                                    <p className="text-danger">
                                        {errors.STR_UTIMAIL?.message}
                                    </p>
                                </div>
                                <div className={`col-md-12`}>
                                    <label
                                        htmlFor="STR_UTIPHONE"
                                        className="form-label"
                                    >
                                        Contact{" "}
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="STR_UTIPHONE"
                                        placeholder="Contact"
                                        {...register("STR_UTIPHONE")}
                                    />
                                    <p className="text-danger">
                                        {errors.STR_UTIPHONE?.message}
                                    </p>
                                </div>
                                {/* {!ID && ( */}
                                <div className="col-md-6 position-relative">
                                    <label
                                        htmlFor="STR_UTIPASSWORD"
                                        className="form-label"
                                    >
                                        Mot de passe{" "}
                                    </label>
                                    <input
                                        type={`${
                                            showPassword ? "text" : "password"
                                        }`}
                                        className="form-control"
                                        id="STR_UTIPASSWORD"
                                        placeholder="Mot de passe"
                                        {...register("STR_UTIPASSWORD")}
                                    />
                                    <button
                                        type="button"
                                        className="btn position-absolute"
                                        style={{ right: 0, top: "35%" }}
                                        onClick={() =>
                                            setShowPassword((v) => !v)
                                        }
                                    >
                                        {showPassword ? (
                                            <i class="ri-eye-off-line"></i>
                                        ) : (
                                            <i class="ri-eye-line"></i>
                                        )}
                                    </button>
                                    <p className="text-danger">
                                        {errors.STR_UTIPASSWORD?.message}
                                    </p>
                                </div>
                                <div className="col-md-6 position-relative">
                                    <label
                                        htmlFor="STR_CONFIRMPASSWORD"
                                        className="form-label"
                                    >
                                        Confirmation mot de passe{" "}
                                    </label>
                                    <input
                                        type={`${
                                            showPassword ? "text" : "password"
                                        }`}
                                        className="form-control"
                                        id="STR_CONFIRMPASSWORD"
                                        placeholder="Mot de passe"
                                        {...register("STR_CONFIRMPASSWORD")}
                                    />
                                    <button
                                        type="button"
                                        className="btn position-absolute"
                                        style={{ right: 0, top: "35%" }}
                                        onClick={() =>
                                            setShowPassword((v) => !v)
                                        }
                                    >
                                        {showPassword ? (
                                            <i class="ri-eye-off-line"></i>
                                        ) : (
                                            <i class="ri-eye-line"></i>
                                        )}
                                    </button>
                                    <p className="text-danger">
                                        {errors.STR_CONFIRMPASSWORD?.message}
                                    </p>
                                </div>
                                {/* )} */}
                                <div className="col-12">
                                    <label
                                        htmlFor="LG_PROID"
                                        className="form-label"
                                    >
                                        Profile utilisateur{" "}
                                    </label>
                                    <Controller
                                        name="LG_PROID"
                                        control={control}
                                        defaultValue={null}
                                        render={({ field }) => (
                                            <AsyncSelect
                                                {...field}
                                                cacheOptions
                                                defaultOptions
                                                loadOptions={fetchSystemProfils}
                                                onChange={(selectedOption) =>
                                                    field.onChange(
                                                        selectedOption
                                                    )
                                                }
                                                value={field.value}
                                            />
                                        )}
                                    />

                                    <p className="text-danger">
                                        {errors.LG_PROID?.message}
                                    </p>
                                </div>
                                {/* <div className="col-12">
                                    <label
                                        htmlFor="STR_UTIPIC"
                                        className="form-label"
                                    >
                                        Photo de profile
                                        <span className="text-muted">
                                            (Optionnelle)
                                        </span>
                                    </label>
                                    <div className="input-group">
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="STR_UTIPIC"
                                            {...register("STR_UTIPIC")}
                                        />
                                    </div>
                                    <p className="text-danger">
                                        {errors.STR_UTIPIC?.message}
                                    </p>
                                </div> */}
                            </div>

                            <div className="hstack gap-2 justify-content-end d-print-none mt-4">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => reset()}
                                >
                                    <i className="ri-refresh-line align-bottom me-1"></i>
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-success"
                                >
                                    <i className="ri-send-plane-fill align-bottom me-1" />{" "}
                                    {ID ? "Modifier" : "Ajouter"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            {/*end col*/}
        </div>
    );
}

export default CreateOrEditUser;
