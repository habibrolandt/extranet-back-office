"use client"

import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { crudData } from "../services/apiService"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { formatPrice, generatePageNumbers } from "../services/lib"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
// Import pour l'export PDF
import { pdf } from "@react-pdf/renderer"
import ListOrderPDF from "../Mescomposants/exportPDF/listOrderPDF"

function Orders() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [totalPage, setTotalPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(() => {
    return Number.parseInt(searchParams.get("page")) || 1
  })
  const [limit, setLimit] = useState(() => {
    return Number.parseInt(searchParams.get("limit")) || 10
  })
  const [status, setStatus] = useState(searchParams.get("status") || null)
  const [isExporting, setIsExporting] = useState(false)

  const [activeFilters, setActiveFilters] = useState(() => {
    const filters = {}
    searchParams.forEach((value, key) => {
      filters[key] = value
    })
    delete filters.limit
    delete filters.page
    return filters
  })

  useEffect(() => {
    const user = localStorage.getItem("user")

    if (!user) {
      navigate("/")
    }
  }, [navigate])

  const handleChangeLimit = (newLimit) => {
    const params = new URLSearchParams()
    params.set("page", 1)
    setSearchParams(params)
    setLimit(newLimit)
  }

  const goToPage = (page) => {
    const params = new URLSearchParams()
    params.set("page", page)
    setSearchParams(params)
    setPage(page)
  }

  const handleSearch = (e) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", 1)
    params.set("search", e)
    setSearchParams(params)
    setPage(1)
    setActiveFilters({
      ...activeFilters,
      search: e,
    })
  }

  const handleStatus = (status) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", 1)
    params.set("status", status)
    setSearchParams(params)
    setPage(1)
    setActiveFilters({
      ...activeFilters,
      status: status,
    })
  }

  const fetchOrders = async (activeFilters) => {
    const data = new URLSearchParams()

    for (const key in activeFilters) {
      if (key === "search") {
        data.append("FILTER_OPTIONS[search]", activeFilters[key])
      }
      if (key === "status") {
        if (activeFilters[key].length > 0) {
          data.append("FILTER_OPTIONS[str_commstatut]", activeFilters[key])
        }
      }
    }

    data.append("LIMIT", limit)
    data.append("PAGE", page)
    data.append("mode", "listeCommandeLocal")

    try {
      const response = await crudData(data, "CommandeManager.php")
      setTotal(response.data.total)
      setTotalPage(() => {
        return Math.ceil(response.data.total / limit)
      })
      return response.data.data
    } catch (error) {
      toast.error(error)
      return []
    }
  }

  const { data, isLoading } = useQuery({
    queryKey: ["orders", activeFilters, page, limit],
    queryFn: () => fetchOrders(activeFilters),
    placeholderData: keepPreviousData,
  })

  // Fonction pour télécharger le PDF
  const handleDownload = async () => {
    if (!data || data.length === 0) {
      toast.warning("Aucune donnée à exporter")
      return
    }

    try {
      setIsExporting(true)
      toast.info("Génération du PDF en cours...")

      // Limiter le nombre d'éléments pour éviter les erreurs de mémoire
      const maxItems = 100
      const dataToExport = data.length > maxItems ? data.slice(0, maxItems) : data

      if (data.length > maxItems) {
        toast.warning(`L'export est limité aux ${maxItems} premières commandes pour des raisons de performance.`)
      }

      // Vérification des données avant génération
      const validData = dataToExport.map((item) => ({
        ...item,
        dbl_commmtttc: item.dbl_commmtttc || 0,
        dbl_commmtht: item.dbl_commmtht || 0,
        str_socname: item.str_socname || "N/A",
        lg_commid: item.lg_commid || "N/A",
        dt_commcreated: item.dt_commcreated || "N/A",
        str_commstatut: item.str_commstatut || "waiting",
      }))

      const blob = await pdf(<ListOrderPDF orders={validData} />).toBlob()
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = `liste-commandes-${new Date().toLocaleDateString().replace(/\//g, "-")}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      //toast.success("PDF généré avec succès")
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error)
      toast.error("Erreur lors de la génération du PDF: " + (error.message || "Erreur inconnue"))
    } finally {
      setIsExporting(false)
    }
  }

  const pageNumbers = generatePageNumbers(totalPage, page)
  return (
    <div className="row">
      <div className="col-lg-12">
        <h2>Liste des commandes</h2>
        <div className="card" id="invoiceList">
          <div className="card-body bg-light-subtle border border-dashed border-start-0 border-end-0">
            <form id="filter-form">
              <div className="row g-3">
                <div className="col-xxl-8 col-sm-12">
                  <div className="search-box">
                    <input
                      type="text"
                      className="form-control search bg-light border-light"
                      placeholder="Rechercher une commande"
                      name="search"
                      value={activeFilters.search || ""}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </div>
                <div className="col-xxl-2 col-sm-4">
                  <div className="input-light">
                    <select
                      className="form-control"
                      name="choices-single-default"
                      id="idStatus"
                      onChange={(e) => {
                        handleStatus(e.target.value)
                      }}
                      value={status || ""}
                    >
                      <option value="">Toutes</option>
                      <option value="closed">Cloturé</option>
                      <option value="waiting">En attente</option>
                    </select>
                  </div>
                </div>
                <div className="col-xxl-2 col-sm-4">
                  <label className="align-items-center">
                    Montrer{" "}
                    <select
                      name="alternative-pagination_length"
                      aria-controls="alternative-pagination"
                      className="form-select form-select-sm d-inline-block"
                      style={{ width: 75 }}
                      onChange={(e) => {
                        handleChangeLimit(e.target.value)
                      }}
                      value={limit.toString()}
                    >
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>{" "}
                    entrées
                  </label>
                </div>
              </div>
            </form>

            {/* Bouton d'exportation PDF */}
            <div className="d-flex justify-content-end mb-3 mt-3">
              <button
                onClick={handleDownload}
                type="button"
                className="btn btn-primary"
                disabled={isExporting || !data || data.length === 0}
              >
                <i className="ri-file-download-line align-middle me-1"></i>
                {isExporting ? "Génération en cours..." : "Exporter en PDF"}
              </button>
            </div>
          </div>
          <div className="card-body">
            <div>
              <div className="table-responsive table-card">
                <table className="table align-middle table-nowrap" id="invoiceTable">
                  <thead className="text-muted">
                    <tr>
                      <th className="text-uppercase th-text-color">#</th>
                      <th className="text-uppercase th-text-color">Nom client</th>
                      <th className="text-uppercase th-text-color">Numero commande</th>
                      <th className="text-uppercase th-text-color">Montant TTC</th>
                      <th className="text-uppercase th-text-color">Montant Hors Taxe</th>
                      <th className="text-uppercase th-text-color">Date de commande</th>
                      <th className="text-uppercase th-text-color">Encours client</th>
                      <th className="text-uppercase th-text-color">Status</th>
                      <th className="text-uppercase th-text-color">Action</th>
                    </tr>
                  </thead>
                  <tbody className="list form-check-all" id="invoice-list-data">
                    {data && data.length > 0 ? (
                      data.map((clientData, index) => (
                        <tr key={index}>
                          <td>
                            <b>#{index + 1}</b>
                          </td>
                          <td>{clientData.str_socname}</td>
                          <td>{clientData.lg_commid}</td>
                          <td>{formatPrice(clientData.dbl_commmtht) + " FCFA"}</td>
                          <td>{formatPrice(clientData.dbl_commmtttc) + " FCFA"}</td>
                          <td>{clientData.dt_commcreated}</td>
                          <td>{clientData.clientEncours ? clientData.clientEncours : "N/A"}</td>
                          <td>
                            <span
                              className={`badge text-uppercase ${
                                clientData.str_commstatut === "waiting"
                                  ? "bg-warning-subtle text-warning"
                                  : "bg-success-subtle text-success"
                              }`}
                            >
                              {clientData.str_commstatut === "waiting" ? "En attente" : "Cloturé"}
                            </span>
                          </td>
                          <td>
                            <div className="dropdown">
                              <Link
                                to={`/commandes/${clientData.lg_commid}`}
                                className="btn btn-soft-secondary btn-sm dropdown btn-details"
                              >
                                Details
                                <i className="ri-arrow-right-line align-middle"></i>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : isLoading ? (
                      <tr>
                        <td colSpan="9" className="text-center">
                          Chargement des commandes
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td colSpan={9} className="text-center">
                          <div
                            className="noresult"
                            style={{
                              display: "block",
                            }}
                          >
                            <div className="text-center">
                              <h5 className="mt-2">Aucune commande trouvée</h5>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-between mt-3 gap-2" style={{ flexWrap: "wrap" }}>
                {data && data.length > 0 ? (
                  <>
                    <div
                      role="status"
                      aria-live="polite"
                      className="gridjs-summary"
                      title={`Page ${page} of ${totalPage}`}
                    >
                      Affichage de <b>{(page - 1) * limit + 1}</b> à <b>{Math.min(page * limit, total)}</b> sur{" "}
                      <b>{total}</b> résultats
                    </div>
                    <div className="pagination-wrap hstack gap-2">
                      <button
                        onClick={() => {
                          goToPage(Math.max(1, page - 1))
                        }}
                        className={`page-item pagination-prev ${page <= 1 ? "disabled" : ""}`}
                        disabled={page <= 1}
                      >
                        Précédent
                      </button>
                      <ul className="pagination listjs-pagination mb-0 d-none d-md-flex">
                        {pageNumbers.map((pageNumber, idx) =>
                          pageNumber === "..." ? (
                            <span key={idx} className="dots">
                              ...
                            </span>
                          ) : (
                            <li className={`${pageNumber === page ? "active" : ""}`} key={idx}>
                              <button
                                onClick={() => goToPage(pageNumber)}
                                className="page"
                                tabIndex="0"
                                data-i={`${idx}`}
                                data-page={`${totalPage}`}
                              >
                                {pageNumber}
                              </button>
                            </li>
                          ),
                        )}
                      </ul>
                      <button
                        onClick={() => {
                          goToPage(Math.min(totalPage, page + 1))
                        }}
                        className={`page-item pagination-next ${page >= totalPage ? "disabled" : ""}`}
                        disabled={page >= totalPage}
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
          </div>
        </div>
      </div>
      {/*end col*/}
    </div>
  )
}

export default Orders
