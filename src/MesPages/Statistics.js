import { fullUrl } from "../services/apiService";
import OrderChart from "../Mescomposants/OrderChart/OrderChart";
import MostPopularProductsCard from "../Mescomposants/MostPopularProductsCard/MostPopularProductsCard";
import BestPurchaserCard from "../Mescomposants/BestPurchaserCard/BestPurchaserCard";

function Statistics() {
    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="row">
                    {" "}
                    <OrderChart />{" "}
                </div>
                <div className="row">
                    <MostPopularProductsCard />
                    <BestPurchaserCard />
                </div>
            </div>
        </div>
    );
}

export default Statistics;

function TabLine({ item }) {
    return (
        <tr>
            <td>
                <div className="d-flex align-items-center">
                    <div className="avatar-sm bg-light rounded p-1 me-2">
                        <img
                            src={`${
                                item.PROPICTURE
                                    ? fullUrl + item.PROPICTURE
                                    : "assets/images/products/img-1.png"
                            }`}
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
                                {item.PRODESCRIPTION}
                            </a>
                        </h5>
                        {/* <span className="text-muted">24 Apr 2021</span> */}
                    </div>
                </div>
            </td>
            <td>
                <h5 className="fs-14 my-1 fw-normal">{item.PROPRICE}</h5>
                <span className="text-muted">Prix de vente</span>
            </td>
            <td>
                <h5 className="fs-14 my-1 fw-normal">{item.PROQUANTITY}</h5>
                <span className="text-muted">Stock</span>
            </td>
            {/* <td>
            <h5 className="fs-14 my-1 fw-normal">$1,798</h5>
            <span className="text-muted">Amount</span>
        </td> */}
            <td>
                <h5 className="fs-14 my-1 fw-normal">{item.PROVIEWED}</h5>
                <span className="text-muted">Nombre de vues</span>
            </td>
        </tr>
    );
}
