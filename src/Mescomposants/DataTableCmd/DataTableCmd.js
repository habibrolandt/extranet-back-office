import React, { useEffect, useState } from "react";
import { generatePageNumbers } from "../../services/lib";

function DataTableCmd({
    commandeList,
    selectedCheckboxes,
    onSelectedAll,
    onSelectedCheckbox,
    deliveryCalendarList = null,
    onGoToPage,
    onChangeLimit,
    option,
    limit,
    page,
    totalPage,
    total,
}) {
    // const [currentData, setCurrentData] = useState([]);
    // const [currentPage, setCurrentPage] = useState(1);

    // const itemPerPage = 5;
    // let indexOfLastItem = currentPage * itemPerPage;
    // let indexOfFirstItem = indexOfLastItem - itemPerPage;

    // useEffect(() => {
    //     setCurrentData(commandeList.slice(indexOfFirstItem, indexOfLastItem));
    // }, [
    //     currentPage,
    //     setCurrentData,
    //     indexOfFirstItem,
    //     indexOfLastItem,
    //     commandeList,
    // ]);

    // useEffect(() => {
    //     console.log(currentData);
    // }, [currentData]);

    // const handleNextPage = () => {
    //     if (indexOfLastItem < commandeList.length) {
    //         setCurrentPage((prevPage) => prevPage + 1);
    //     }
    // };

    // const handlePreviousPage = () => {
    //     if (indexOfFirstItem > 0) {
    //         setCurrentPage((prevPage) => prevPage - 1);
    //     }
    // };

    let Tbody = null;
    switch (option) {
        case "edit":
            Tbody = (
                <TbodyEdit
                    data={commandeList}
                    selectedCheckboxes={selectedCheckboxes}
                    deliveryCalendarList={deliveryCalendarList}
                    onSelectedCheckbox={onSelectedCheckbox}
                />
            );
            break;
        case "create":
            Tbody = (
                <TbodyCreate
                    data={commandeList}
                    selectedCheckboxes={selectedCheckboxes}
                    onSelectedCheckbox={onSelectedCheckbox}
                />
            );
            break;
        default:
            break;
    }

    const pageNumbers = generatePageNumbers(totalPage, page);

    return (
        <div
            className="table-responsive table-card mb-1 p-3 d-flex flex-column"
            style={{ minHeight: "388px" }}
        >
            <label>Commandes sur le calendrier</label>
            <table
                className="table align-middle table-nowrap"
                id="customerTable"
            >
                <thead className="table-light">
                    <tr>
                        <th scope="col" style={{ width: "50px" }}>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="checkAll"
                                    checked={
                                        selectedCheckboxes.length ===
                                        commandeList.length
                                    }
                                    onChange={onSelectedAll}
                                />
                            </div>
                        </th>
                        <th className="text-uppercase th-text-color">Nom client</th>
                        <th className="text-uppercase th-text-color">Numero commande</th>
                        <th className="text-uppercase th-text-color">Date de commande</th>
                    </tr>
                </thead>
                {/* <tbody className="list form-check-all">
                    {currentData.length > 0 &&
                        currentData.map((item, index) => (
                            <tr key={index}>
                                <th scope="row">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="chk_child"
                                            checked={selectedCheckboxes.includes(
                                                index
                                            )}
                                            onChange={() =>
                                                onSelectedCheckbox(index)
                                            }
                                            disabled={
                                                item.lg_livid !== null &&
                                                item.lg_livid !==
                                                    deliveryCalendarList[0]
                                                        .lg_livid
                                            }
                                            data-id={item.lg_livid}
                                        />
                                    </div>
                                </th>
                                <td className="customer_name">
                                    {item.str_socname}
                                </td>
                                <td className="phone">{item.lg_commid}</td>
                                <td className="date">{item.dt_commcreated}</td>
                            </tr>
                        ))}
                </tbody> */}
                {Tbody}
            </table>
            <div className="d-flex justify-content-between mt-3 flex-wrap gap-2">
                {commandeList && commandeList.length > 0 ? (
                    <>
                        <div
                            role="status"
                            aria-live="polite"
                            className="gridjs-summary"
                            title="Page 2 of 2"
                        >
                            Affichage de <b>{limit * page - (limit - 1)}</b> à{" "}
                            <b>{limit * page > total ? total : limit * page}</b>{" "}
                            sur <b>{total}</b> resultats
                        </div>
                        <div className="pagination-wrap hstack gap-2">
                            <button
                                onClick={() => {
                                    onGoToPage(Math.max(1, page - 1));
                                }}
                                className={`page-item pagination-prev ${
                                    page - 1 === 0 ? "disabled" : ""
                                }`}
                                disabled={page - 1 === 0}
                                type="button"
                            >
                                Précedent
                            </button>
                            <ul className="pagination listjs-pagination mb-0">
                                {pageNumbers.map((pageNumber, index) =>
                                    pageNumber === "..." ? (
                                        <span key={index} className="dots">
                                            ...
                                        </span>
                                    ) : (
                                        <li
                                            className={`${
                                                pageNumber === page
                                                    ? "active"
                                                    : ""
                                            }`}
                                            key={index}
                                        >
                                            {/* <buttonn class="page" href="#" data-i="1" data-page="8">
                                                                </buttonn> */}
                                            <button
                                                onClick={() =>
                                                    onGoToPage(pageNumber)
                                                }
                                                className={`page
                                                                    }`}
                                                tabIndex="0"
                                                data-i={`${index}`}
                                                data-page={`${totalPage}`}
                                                type="button"
                                            >
                                                {pageNumber}
                                            </button>
                                        </li>
                                    )
                                )}
                            </ul>
                            <button
                                onClick={() => {
                                    onGoToPage(Math.min(totalPage, page + 1));
                                }}
                                className={`page-item pagination-next ${
                                    page + 1 > totalPage
                                        ? "disabled"
                                        : ""
                                }`}
                                disabled={page + 1 > totalPage}
                                type="button"
                            >
                                Suivant
                            </button>
                        </div>
                    </>
                ) : (
                    ""
                )}
            </div>
        </div>
    );
}

const TbodyEdit = ({
    data,
    selectedCheckboxes,
    deliveryCalendarList,
    onSelectedCheckbox,
}) => {
    return (
        <tbody className="list form-check-all">
            {data.length > 0 &&
                data.map((item, index) => (
                    <tr key={index}>
                        <th scope="row">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="chk_child"
                                    checked={selectedCheckboxes.includes(index)}
                                    onChange={() => onSelectedCheckbox(index)}
                                    disabled={
                                        item.lg_livid !== null &&
                                        item.lg_livid !==
                                            deliveryCalendarList.lg_livid
                                    }
                                    data-id={item.lg_livid}
                                />
                            </div>
                        </th>
                        <td className="customer_name">{item.str_socname}</td>
                        <td className="phone">{item.lg_commid}</td>
                        <td className="date">{item.dt_commcreated}</td>
                    </tr>
                ))}
        </tbody>
    );
};

const TbodyCreate = ({ data, selectedCheckboxes, onSelectedCheckbox }) => {
    return (
        <tbody className="list form-check-all">
            {data &&
                data.map(
                    (item, index) =>
                        item.lg_livid === null && (
                            <tr>
                                <th scope="row">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="chk_child"
                                            checked={selectedCheckboxes.includes(
                                                index
                                            )}
                                            onChange={() =>
                                                onSelectedCheckbox(index)
                                            }
                                        />
                                    </div>
                                </th>
                                <td className="customer_name">
                                    {item.str_socname}
                                </td>
                                <td className="phone">{item.lg_commid}</td>
                                <td className="date">{item.dt_commcreated}</td>
                            </tr>
                        )
                )}
        </tbody>
    );
};

export default DataTableCmd;
