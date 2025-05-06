import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProductStat() {
    const navigate = useNavigate();

    
    useEffect(() => {
        const user = localStorage.getItem("user");

        if (!user) {
            navigate("/");
        }
    }, [navigate]);



    return (
        <div>
            <div className="row">
                <div className="col-xl-6">
                    <div className="card">
                        <div className="card-header align-items-center d-flex">
                            <h4 className="card-title mb-0 flex-grow-1">
                                Best Selling Products
                            </h4>
                            <div className="flex-shrink-0">
                                <div className="dropdown card-header-dropdown">
                                    <a
                                        className="text-reset dropdown-btn"
                                        href="#"
                                        data-bs-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                    >
                                        <span className="fw-semibold text-uppercase fs-12">
                                            Sort by:
                                        </span>
                                        <span className="text-muted">
                                            Today
                                            <i className="mdi mdi-chevron-down ms-1" />
                                        </span>
                                    </a>
                                    <div
                                        className="dropdown-menu dropdown-menu-end"
                                        style={{}}
                                    >
                                        <a className="dropdown-item" href="#">
                                            Today
                                        </a>
                                        <a className="dropdown-item" href="#">
                                            Yesterday
                                        </a>
                                        <a className="dropdown-item" href="#">
                                            Last 7 Days
                                        </a>
                                        <a className="dropdown-item" href="#">
                                            Last 30 Days
                                        </a>
                                        <a className="dropdown-item" href="#">
                                            This Month
                                        </a>
                                        <a className="dropdown-item" href="#">
                                            Last Month
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* end card header */}
                        <div className="card-body">
                            <div className="table-responsive table-card">
                                <table className="table table-hover table-centered align-middle table-nowrap mb-0">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar-sm bg-light rounded p-1 me-2">
                                                        <img
                                                            src="assets/images/products/img-1.png"
                                                            alt=""
                                                            className="img-fluid d-block"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h5 className="fs-14 my-1">
                                                            <a
                                                                href="apps-ecommerce-product-details.html"
                                                                className="text-reset"
                                                            >
                                                                Branded T-Shirts
                                                            </a>
                                                        </h5>
                                                        <span className="text-muted">
                                                            24 Apr 2021
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <h5 className="fs-14 my-1 fw-normal">
                                                    $29.00
                                                </h5>
                                                <span className="text-muted">
                                                    Price
                                                </span>
                                            </td>
                                            <td>
                                                <h5 className="fs-14 my-1 fw-normal">
                                                    62
                                                </h5>
                                                <span className="text-muted">
                                                    Orders
                                                </span>
                                            </td>
                                            <td>
                                                <h5 className="fs-14 my-1 fw-normal">
                                                    510
                                                </h5>
                                                <span className="text-muted">
                                                    Stock
                                                </span>
                                            </td>
                                            <td>
                                                <h5 className="fs-14 my-1 fw-normal">
                                                    $1,798
                                                </h5>
                                                <span className="text-muted">
                                                    Amount
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar-sm bg-light rounded p-1 me-2">
                                                        <img
                                                            src="assets/images/products/img-2.png"
                                                            alt=""
                                                            className="img-fluid d-block"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h5 className="fs-14 my-1">
                                                            <a
                                                                href="apps-ecommerce-product-details.html"
                                                                className="text-reset"
                                                            >
                                                                Bentwood Chair
                                                            </a>
                                                        </h5>
                                                        <span className="text-muted">
                                                            19 Mar 2021
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <h5 className="fs-14 my-1 fw-normal">
                                                    $85.20
                                                </h5>
                                                <span className="text-muted">
                                                    Price
                                                </span>
                                            </td>
                                            <td>
                                                <h5 className="fs-14 my-1 fw-normal">
                                                    35
                                                </h5>
                                                <span className="text-muted">
                                                    Orders
                                                </span>
                                            </td>
                                            <td>
                                                <h5 className="fs-14 my-1 fw-normal">
                                                    <span className="badge bg-danger-subtle text-danger">
                                                        Out of stock
                                                    </span>{" "}
                                                </h5>
                                                <span className="text-muted">
                                                    Stock
                                                </span>
                                            </td>
                                            <td>
                                                <h5 className="fs-14 my-1 fw-normal">
                                                    $2982
                                                </h5>
                                                <span className="text-muted">
                                                    Amount
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar-sm bg-light rounded p-1 me-2">
                                                        <img
                                                            src="assets/images/products/img-3.png"
                                                            alt=""
                                                            className="img-fluid d-block"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h5 className="fs-14 my-1">
                                                            <a
                                                                href="apps-ecommerce-product-details.html"
                                                                className="text-reset"
                                                            >
                                                                Borosil Paper
                                                                Cup
                                                            </a>
                                                        </h5>
                                                        <span className="text-muted">
                                                            01 Mar 2021
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <h5 className="fs-14 my-1 fw-normal">
                                                    $14.00
                                                </h5>
                                                <span className="text-muted">
                                                    Price
                                                </span>
                                            </td>
                                            <td>
                                                <h5 className="fs-14 my-1 fw-normal">
                                                    80
                                                </h5>
                                                <span className="text-muted">
                                                    Orders
                                                </span>
                                            </td>
                                            <td>
                                                <h5 className="fs-14 my-1 fw-normal">
                                                    749
                                                </h5>
                                                <span className="text-muted">
                                                    Stock
                                                </span>
                                            </td>
                                            <td>
                                                <h5 className="fs-14 my-1 fw-normal">
                                                    $1120
                                                </h5>
                                                <span className="text-muted">
                                                    Amount
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar-sm bg-light rounded p-1 me-2">
                                                        <img
                                                            src="assets/images/products/img-4.png"
                                                            alt=""
                                                            className="img-fluid d-block"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h5 className="fs-14 my-1">
                                                            <a
                                                                href="apps-ecommerce-product-details.html"
                                                                className="text-reset"
                                                            >
                                                                One Seater Sofa
                                                            </a>
                                                        </h5>
                                                        <span className="text-muted">
                                                            11 Feb 2021
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <h5 className="fs-14 my-1 fw-normal">
                                                    $127.50
                                                </h5>
                                                <span className="text-muted">
                                                    Price
                                                </span>
                                            </td>
                                            <td>
                                                <h5 className="fs-14 my-1 fw-normal">
                                                    56
                                                </h5>
                                                <span className="text-muted">
                                                    Orders
                                                </span>
                                            </td>
                                            <td>
                                                <h5 className="fs-14 my-1 fw-normal">
                                                    <span className="badge bg-danger-subtle text-danger">
                                                        Out of stock
                                                    </span>
                                                </h5>
                                                <span className="text-muted">
                                                    Stock
                                                </span>
                                            </td>
                                            <td>
                                                <h5 className="fs-14 my-1 fw-normal">
                                                    $7140
                                                </h5>
                                                <span className="text-muted">
                                                    Amount
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar-sm bg-light rounded p-1 me-2">
                                                        <img
                                                            src="assets/images/products/img-5.png"
                                                            alt=""
                                                            className="img-fluid d-block"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h5 className="fs-14 my-1">
                                                            <a
                                                                href="apps-ecommerce-product-details.html"
                                                                className="text-reset"
                                                            >
                                                                Stillbird Helmet
                                                            </a>
                                                        </h5>
                                                        <span className="text-muted">
                                                            17 Jan 2021
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <h5 className="fs-14 my-1 fw-normal">
                                                    $54
                                                </h5>
                                                <span className="text-muted">
                                                    Price
                                                </span>
                                            </td>
                                            <td>
                                                <h5 className="fs-14 my-1 fw-normal">
                                                    74
                                                </h5>
                                                <span className="text-muted">
                                                    Orders
                                                </span>
                                            </td>
                                            <td>
                                                <h5 className="fs-14 my-1 fw-normal">
                                                    805
                                                </h5>
                                                <span className="text-muted">
                                                    Stock
                                                </span>
                                            </td>
                                            <td>
                                                <h5 className="fs-14 my-1 fw-normal">
                                                    $3996
                                                </h5>
                                                <span className="text-muted">
                                                    Amount
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="align-items-center mt-4 pt-2 justify-content-between row text-center text-sm-start">
                                <div className="col-sm">
                                    <div className="text-muted">
                                        Showing{" "}
                                        <span className="fw-semibold">5</span>{" "}
                                        of{" "}
                                        <span className="fw-semibold">25</span>{" "}
                                        Results
                                    </div>
                                </div>
                                <div className="col-sm-auto  mt-3 mt-sm-0">
                                <ul className="pagination pagination-separated pagination-sm mb-0 justify-content-center">
                                        <li className="page-item disabled">
                                            <button className="page-link">←</button>
                                        </li>
                                        <li className="page-item">
                                            <button className="page-link">→</button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-6">
                    <div className="card card-height-100">
                        <div className="card-header align-items-center d-flex">
                            <h4 className="card-title mb-0 flex-grow-1">
                                Top Sellers
                            </h4>
                            <div className="flex-shrink-0">
                                <div className="dropdown card-header-dropdown">
                                    <a
                                        className="text-reset dropdown-btn"
                                        href="#"
                                        data-bs-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                    >
                                        <span className="text-muted">
                                            Report
                                            <i className="mdi mdi-chevron-down ms-1" />
                                        </span>
                                    </a>
                                    <div className="dropdown-menu dropdown-menu-end">
                                        <a className="dropdown-item" href="#">
                                            Download Report
                                        </a>
                                        <a className="dropdown-item" href="#">
                                            Export
                                        </a>
                                        <a className="dropdown-item" href="#">
                                            Import
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* end card header */}
                        <div className="card-body">
                            <div className="table-responsive table-card">
                                <table className="table table-centered table-hover align-middle table-nowrap mb-0">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-shrink-0 me-2">
                                                        <img
                                                            src="assets/images/companies/img-1.png"
                                                            alt=""
                                                            className="avatar-sm p-2"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h5 className="fs-14 my-1 fw-medium">
                                                            <a
                                                                href="apps-ecommerce-seller-details.html"
                                                                className="text-reset"
                                                            >
                                                                iTest Factory
                                                            </a>
                                                        </h5>
                                                        <span className="text-muted">
                                                            Oliver Tyler
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="text-muted">
                                                    Bags and Wallets
                                                </span>
                                            </td>
                                            <td>
                                                <p className="mb-0">8547</p>
                                                <span className="text-muted">
                                                    Stock
                                                </span>
                                            </td>
                                            <td>
                                                <span className="text-muted">
                                                    $541200
                                                </span>
                                            </td>
                                            <td>
                                                <h5 className="fs-14 mb-0">
                                                    32%
                                                    <i className="ri-bar-chart-fill text-success fs-16 align-middle ms-2" />
                                                </h5>
                                            </td>
                                        </tr>
                                        {/* end */}
                                        <tr>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-shrink-0 me-2">
                                                        <img
                                                            src="assets/images/companies/img-2.png"
                                                            alt=""
                                                            className="avatar-sm p-2"
                                                        />
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <h5 className="fs-14 my-1 fw-medium">
                                                            <a
                                                                href="apps-ecommerce-seller-details.html"
                                                                className="text-reset"
                                                            >
                                                                Digitech Galaxy
                                                            </a>
                                                        </h5>
                                                        <span className="text-muted">
                                                            John Roberts
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="text-muted">
                                                    Watches
                                                </span>
                                            </td>
                                            <td>
                                                <p className="mb-0">895</p>
                                                <span className="text-muted">
                                                    Stock
                                                </span>
                                            </td>
                                            <td>
                                                <span className="text-muted">
                                                    $75030
                                                </span>
                                            </td>
                                            <td>
                                                <h5 className="fs-14 mb-0">
                                                    79%
                                                    <i className="ri-bar-chart-fill text-success fs-16 align-middle ms-2" />
                                                </h5>
                                            </td>
                                        </tr>
                                        {/* end */}
                                        <tr>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-shrink-0 me-2">
                                                        <img
                                                            src="assets/images/companies/img-3.png"
                                                            alt=""
                                                            className="avatar-sm p-2"
                                                        />
                                                    </div>
                                                    <div className="flex-gow-1">
                                                        <h5 className="fs-14 my-1 fw-medium">
                                                            <a
                                                                href="apps-ecommerce-seller-details.html"
                                                                className="text-reset"
                                                            >
                                                                Nesta
                                                                Technologies
                                                            </a>
                                                        </h5>
                                                        <span className="text-muted">
                                                            Harley Fuller
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="text-muted">
                                                    Bike Accessories
                                                </span>
                                            </td>
                                            <td>
                                                <p className="mb-0">3470</p>
                                                <span className="text-muted">
                                                    Stock
                                                </span>
                                            </td>
                                            <td>
                                                <span className="text-muted">
                                                    $45600
                                                </span>
                                            </td>
                                            <td>
                                                <h5 className="fs-14 mb-0">
                                                    90%
                                                    <i className="ri-bar-chart-fill text-success fs-16 align-middle ms-2" />
                                                </h5>
                                            </td>
                                        </tr>
                                        {/* end */}
                                        <tr>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-shrink-0 me-2">
                                                        <img
                                                            src="assets/images/companies/img-8.png"
                                                            alt=""
                                                            className="avatar-sm p-2"
                                                        />
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <h5 className="fs-14 my-1 fw-medium">
                                                            <a
                                                                href="apps-ecommerce-seller-details.html"
                                                                className="text-reset"
                                                            >
                                                                Zoetic Fashion
                                                            </a>
                                                        </h5>
                                                        <span className="text-muted">
                                                            James Bowen
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="text-muted">
                                                    Clothes
                                                </span>
                                            </td>
                                            <td>
                                                <p className="mb-0">5488</p>
                                                <span className="text-muted">
                                                    Stock
                                                </span>
                                            </td>
                                            <td>
                                                <span className="text-muted">
                                                    $29456
                                                </span>
                                            </td>
                                            <td>
                                                <h5 className="fs-14 mb-0">
                                                    40%
                                                    <i className="ri-bar-chart-fill text-success fs-16 align-middle ms-2" />
                                                </h5>
                                            </td>
                                        </tr>
                                        {/* end */}
                                        <tr>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-shrink-0 me-2">
                                                        <img
                                                            src="assets/images/companies/img-5.png"
                                                            alt=""
                                                            className="avatar-sm p-2"
                                                        />
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <h5 className="fs-14 my-1 fw-medium">
                                                            <a
                                                                href="apps-ecommerce-seller-details.html"
                                                                className="text-reset"
                                                            >
                                                                Meta4Systems
                                                            </a>
                                                        </h5>
                                                        <span className="text-muted">
                                                            Zoe Dennis
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="text-muted">
                                                    Furniture
                                                </span>
                                            </td>
                                            <td>
                                                <p className="mb-0">4100</p>
                                                <span className="text-muted">
                                                    Stock
                                                </span>
                                            </td>
                                            <td>
                                                <span className="text-muted">
                                                    $11260
                                                </span>
                                            </td>
                                            <td>
                                                <h5 className="fs-14 mb-0">
                                                    57%
                                                    <i className="ri-bar-chart-fill text-success fs-16 align-middle ms-2" />
                                                </h5>
                                            </td>
                                        </tr>
                                        {/* end */}
                                    </tbody>
                                </table>
                                {/* end table */}
                            </div>
                            <div className="align-items-center mt-4 pt-2 justify-content-between row text-center text-sm-start">
                                <div className="col-sm">
                                    <div className="text-muted">
                                        Showing{" "}
                                        <span className="fw-semibold">5</span>{" "}
                                        of{" "}
                                        <span className="fw-semibold">25</span>{" "}
                                        Results
                                    </div>
                                </div>
                                <div className="col-sm-auto  mt-3 mt-sm-0">
                                    <ul className="pagination pagination-separated pagination-sm mb-0 justify-content-center">
                                        <li className="page-item disabled">
                                            <button className="page-link">←</button>
                                        </li>
                                        <li className="page-item">
                                            <button className="page-link">→</button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>{" "}
                        {/* .card-body*/}
                    </div>{" "}
                    {/* .card*/}
                </div>{" "}
                {/* .col*/}
            </div>
        </div>
    );
}

export default ProductStat;
