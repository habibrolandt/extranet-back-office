import React, { useState } from "react";

const TableWithPaginationHOC = (WrappedComponent) => {
    const WithPagination = (props) => {
        const { data } = props;

        const [currentPage, setCurrentPage] = useState(1);

        const itemsPerPage = 4;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = data.slice(startIndex, endIndex);
        const totalPages = Math.ceil(data.length / itemsPerPage);

        const goToPage = (page) => {
            setCurrentPage(page);
        };

        return (
            <div>
                <WrappedComponent {...props} data={paginatedData} />

                <div className="d-flex justify-content-end">
                    <div className="pagination-wrap hstack gap-2">
                        <button
                            className={`page-item pagination-prev ${
                                currentPage === 1 ? "disabled" : ""
                            }`}
                            onClick={() =>
                                goToPage(Math.max(1, currentPage - 1))
                            }
                            disabled={currentPage === 1}
                        >
                            Précedent
                        </button>
                        <ul className="pagination listjs-pagination mb-0">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <li
                                    key={index}
                                    className={`page-item ${
                                        currentPage === index + 1
                                            ? "active"
                                            : ""
                                    }`}
                                >
                                    <button
                                        type="button"
                                        className="page-link"
                                        onClick={() =>
                                            setCurrentPage(index + 1)
                                        }
                                    >
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button
                            className={`page-item pagination-next ${
                                currentPage === totalPages ? "disabled" : ""
                            }`}
                            onClick={() =>
                                goToPage(Math.min(totalPages, currentPage + 1))
                            }
                            disabled={currentPage === totalPages}
                        >
                            Suivant
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return WithPagination;
};

export default TableWithPaginationHOC;
