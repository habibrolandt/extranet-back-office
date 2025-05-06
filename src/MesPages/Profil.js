import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { updateUser } from "../api/User";
import { EditAdminInfosSchema } from "../services/formSchema";
import { useUserData } from "../contexts/UserDataContext";
import { fullUrl } from "../services/apiService";

function Profil() {
    const { user, handleSetUserData } = useUserData();
    const [showPassword, setShowPassword] = useState(false);
    const [userPicture, setUserPicture] = useState(null);
    const [userPicturePreview, setUserPicturePreview] = useState();

    const handleAddUserPicture = (e) => {
        const file = e.target.files[0];

        if (file) {
            setUserPicture((prev) => file);
            const previewUrl = URL.createObjectURL(file);
            setUserPicturePreview(previewUrl);
        }
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(EditAdminInfosSchema),
    });

    useEffect(() => {
        if (user) {
            reset({
                STR_UTIFIRSTLASTNAME: user.STR_UTIFIRSTLASTNAME,
                STR_UTIPHONE: user.STR_UTIPHONE,
                STR_UTIMAIL: user.STR_UTIMAIL,
                STR_UTILOGIN: user.STR_UTILOGIN,
                LG_UTIID: user.LG_UTIID,
            });
        }
    }, [user, reset]);

    const onSubmit = async (data) => {
        let currentData = data;

        if (
            data.STR_UTIPASSWORD === user.STR_UTIPASSWORD ||
            (data.STR_CONFIRMPASSWORD === "" && data.STR_UTIPASSWORD === "")
        ) {
            delete currentData.STR_CONFIRMPASSWORD;
            delete currentData.STR_UTIPASSWORD;
        } else {
            delete currentData.STR_CONFIRMPASSWORD;
        }
        currentData = {
            ...currentData,
            LG_UTIID: user.LG_UTIID,
            LG_PROID: user.LG_PROID,
            STR_UTIPIC: userPicture ?? null,
        };
        let result = await updateUser(currentData);
        if (result) {
            reset({
                STR_UTIFIRSTLASTNAME: data.STR_UTIFIRSTLASTNAME,
                STR_UTIPHONE: data.STR_UTIPHONE,
                STR_UTILOGIN: data.STR_UTILOGIN,
                STR_UTIMAIL: data.STR_UTIMAIL,
                STR_UTIPASSWORD: "",
                STR_CONFIRMPASSWORD: "",
            });
            let newUser = user;
            newUser = {
                ...newUser,
                STR_UTIFIRSTLASTNAME: data.STR_UTIFIRSTLASTNAME,
                STR_UTIPHONE: data.STR_UTIPHONE,
                STR_UTILOGIN: data.STR_UTILOGIN,
                STR_UTIMAIL: data.STR_UTIMAIL,
            };

            if (typeof result === "string") {
                newUser.STR_UTIPIC = result;
            }
            handleSetUserData(newUser);
        }
    };

    return (
        <div className="container-fluid">
            <div
                className="position-relative mt-n4"
                style={{ marginRight: "-2.5rem", marginLeft: "-2.5rem" }}
            >
                <div className="profile-wid-bg profile-setting-img">
                    <img
                        src="assets/images/profile-bg.jpg"
                        className="profile-wid-img"
                        alt=""
                    />
                    <div className="overlay-content">
                        <div className="text-end p-3">
                            <div className="p-0 ms-auto rounded-circle profile-photo-edit">
                                <input
                                    id="profile-foreground-img-file-input"
                                    type="file"
                                    className="profile-foreground-img-file-input"
                                />
                                {/* <label
                                    htmlFor="profile-foreground-img-file-input"
                                    className="profile-photo-edit btn btn-light"
                                >
                                    <i className="ri-image-edit-line align-bottom me-1"></i>{" "}
                                    Change Cover
                                </label> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-xxl-3 mt-n5">
                    <div className="card ">
                        <div className="card-body p-4">
                            <div className="text-center">
                                <div className="profile-user position-relative d-inline-block mx-auto  mb-4">
                                    {/* {user && user?.STR_UTIPIC ? (
                                        
                                    ) : ( */}
                                    <img
                                        // src={`${userPicture}`}
                                        src={
                                            !userPicturePreview
                                                ? fullUrl + user?.STR_UTIPIC
                                                : userPicturePreview
                                        }
                                        className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                                        alt="user-profile"
                                    />
                                    {/* )} */}
                                    <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                                        <input
                                            id="profile-img-file-input"
                                            type="file"
                                            className="profile-img-file-input"
                                            onChange={handleAddUserPicture}
                                        />
                                        <label
                                            for="profile-img-file-input"
                                            className="profile-photo-edit avatar-xs"
                                        >
                                            <span className="avatar-title rounded-circle bg-light text-body">
                                                <i className="ri-camera-fill"></i>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                <h5 className="fs-16 mb-1">
                                    {user && user?.STR_UTIFIRSTLASTNAME}
                                </h5>
                                <p className="text-muted mb-0">
                                    {user && user?.STR_PRODESCRIPTION}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title mb-3">Info</h5>
                            <div className="table-responsive">
                                <table className="table table-borderless mb-0">
                                    <tbody>
                                        <tr>
                                            <th className="ps-0" scope="row">
                                                Nom complet:
                                            </th>
                                            <td className="text-muted">
                                                {user &&
                                                    user.STR_UTIFIRSTLASTNAME}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="ps-0" scope="row">
                                                Mobile :
                                            </th>
                                            <td className="text-muted">
                                                {user && user.STR_UTIPHONE}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="ps-0" scope="row">
                                                E-mail :
                                            </th>
                                            <td className="text-muted">
                                                {user && user.STR_UTIMAIL}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="ps-0" scope="row">
                                                Login
                                            </th>
                                            <td className="text-muted">
                                                {user && user.STR_UTILOGIN}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xxl-9">
                    <div className="card mt-xxl-n5">
                        <div className="card-header">
                            <ul
                                className="nav nav-tabs-custom rounded card-header-tabs border-bottom-0"
                                role="tablist"
                            >
                                <li className="nav-item" role="presentation">
                                    <a
                                        className="nav-link text-primary active"
                                        data-bs-toggle="tab"
                                        href="#personalDetails"
                                        role="tab"
                                        aria-selected="true"
                                    >
                                        Information personnel
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="card-body p-4">
                            <div className="tab-content">
                                <div
                                    className="tab-pane active show"
                                    id="personalDetails"
                                    role="tabpanel"
                                >
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="mb-3">
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
                                                        {...register(
                                                            "STR_UTIFIRSTLASTNAME"
                                                        )}
                                                    />
                                                    <p className="text-danger">
                                                        {
                                                            errors
                                                                .STR_UTIFIRSTLASTNAME
                                                                ?.message
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <label
                                                        htmlFor="STR_UTILOGIN"
                                                        className="form-label"
                                                    >
                                                        Login
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="STR_UTILOGIN"
                                                        placeholder="Nom d'utilisateur"
                                                        {...register(
                                                            "STR_UTILOGIN"
                                                        )}
                                                    />
                                                    <p className="text-danger">
                                                        {
                                                            errors.STR_UTILOGIN
                                                                ?.message
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            {/*end col*/}
                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <label
                                                        htmlFor="STR_UTIMAIL"
                                                        className="form-label"
                                                    >
                                                        Adresse email
                                                    </label>
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        id="STR_UTIMAIL"
                                                        placeholder="Email"
                                                        {...register(
                                                            "STR_UTIMAIL"
                                                        )}
                                                    />
                                                    <p className="text-danger">
                                                        {
                                                            errors.STR_UTIMAIL
                                                                ?.message
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            {/*end col*/}
                                            <div className="col-lg-12">
                                                <div className="mb-3">
                                                    <label
                                                        htmlFor="STR_UTIPHONE"
                                                        className="form-label"
                                                    >
                                                        Contact
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="STR_UTIPHONE"
                                                        placeholder="Contact"
                                                        {...register(
                                                            "STR_UTIPHONE"
                                                        )}
                                                    />
                                                    <p className="text-danger">
                                                        {
                                                            errors.STR_UTIPHONE
                                                                ?.message
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <label
                                                        htmlFor="STR_UTIPASSWORD"
                                                        className="form-label"
                                                    >
                                                        Mot de passe
                                                    </label>
                                                    <input
                                                        type={`${
                                                            showPassword
                                                                ? "text"
                                                                : "password"
                                                        }`}
                                                        className="form-control"
                                                        id="STR_UTIPASSWORD"
                                                        placeholder="Mot de passe"
                                                        {...register(
                                                            "STR_UTIPASSWORD"
                                                        )}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn position-absolute"
                                                        style={{
                                                            right: 0,
                                                            top: "35%",
                                                        }}
                                                        onClick={() =>
                                                            setShowPassword(
                                                                (v) => !v
                                                            )
                                                        }
                                                    >
                                                        {showPassword ? (
                                                            <i class="ri-eye-off-line"></i>
                                                        ) : (
                                                            <i class="ri-eye-line"></i>
                                                        )}
                                                    </button>
                                                    <p className="text-danger">
                                                        {
                                                            errors
                                                                .STR_UTIPASSWORD
                                                                ?.message
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            {/*end col*/}
                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <label
                                                        htmlFor="STR_CONFIRMPASSWORD"
                                                        className="form-label"
                                                    >
                                                        Confirmation du mot de
                                                        passe
                                                    </label>
                                                    <input
                                                        type={`${
                                                            showPassword
                                                                ? "text"
                                                                : "password"
                                                        }`}
                                                        className="form-control"
                                                        id="STR_CONFIRMPASSWORD"
                                                        placeholder="Mot de passe"
                                                        {...register(
                                                            "STR_CONFIRMPASSWORD"
                                                        )}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn position-absolute"
                                                        style={{
                                                            right: 0,
                                                            top: "35%",
                                                        }}
                                                        onClick={() =>
                                                            setShowPassword(
                                                                (v) => !v
                                                            )
                                                        }
                                                    >
                                                        {showPassword ? (
                                                            <i class="ri-eye-off-line"></i>
                                                        ) : (
                                                            <i class="ri-eye-line"></i>
                                                        )}
                                                    </button>
                                                    <p className="text-danger">
                                                        {
                                                            errors
                                                                .STR_CONFIRMPASSWORD
                                                                ?.message
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="col-lg-12">
                                                <div className="hstack gap-2 justify-content-end">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary"
                                                    >
                                                        Editer
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-light"
                                                    >
                                                        Annuler
                                                    </button>
                                                </div>
                                            </div>
                                            {/*end col*/}
                                        </div>
                                        {/*end row*/}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profil;
