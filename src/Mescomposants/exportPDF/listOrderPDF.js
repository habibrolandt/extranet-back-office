import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import { formatPrice } from "../../services/lib"

// Ne pas utiliser Font.register pour éviter les problèmes de DataView

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  smallText: {
    fontSize: 7,
  },
  companyName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#214293",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ddd",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    fontSize: 10,
  },
  tableCellNumber: {
    width: "5%",
  },
  tableCellClient: {
    width: "25%",
    textAlign: "left",
  },
  tableCellCommande: {
    width: "15%",
    textAlign: "left",
  },
  tableCellMontant: {
    width: "15%",
    textAlign: "right",
  },
  tableCellDate: {
    width: "20%",
    textAlign: "left",
  },
  tableCellEncours: {
    width: "10%",
    textAlign: "center",
  },
  tableCellStatus: {
    width: "10%",
    textAlign: "center",
  },
  totals: {
    marginTop: 20,
    textAlign: "right",
    fontSize: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#214293",
  },
  headerRow: {
    backgroundColor: "#214293",
  },
  headerText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  footer: {
    textAlign: "center",
    marginTop: 50,
  },
  footerText: {
    fontSize: 12,
    color: "#214293",
  },
})

const ListOrderPDF = ({ orders }) => {
  // Vérification que orders est bien un tableau
  const validOrders = Array.isArray(orders) ? orders : []

  // Fonction sécurisée pour calculer les totaux
  const calculateTotal = (items, field) => {
    return items.reduce((total, item) => {
      const value = Number.parseFloat(item[field] || 0)
      return isNaN(value) ? total : total + value
    }, 0)
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête simplifié */}
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>SN PROVECI</Text>
          </View>
          <View>
            <Text style={styles.smallText}>Email: snproveci@snproveci.com - comptoir@snproveci.com</Text>
            <Text style={[styles.smallText, { color: "#214293" }]}>Website: https://djx.975.mytemp.website/</Text>
            <Text style={styles.smallText}>
              Contact: (+225) 27 21 35 30 27 - (+225) 01 02 48 70 53 - (+225) 01 02 50 44 40
            </Text>
            <Text style={styles.smallText}>Fax: (+225) 27 21 35 30 29</Text>
          </View>
        </View>

        <Text style={styles.title}>Liste des Commandes</Text>
        <Text
          style={{
            fontSize: 8,
            textAlign: "right",
            marginBottom: 10,
          }}
        >
          Date d'exportation: {new Date().toLocaleDateString()}
        </Text>

        {/* Tableau des commandes */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.headerRow]}>
            <Text style={[styles.tableCell, styles.tableCellNumber, styles.headerText]}>#</Text>
            <Text style={[styles.tableCell, styles.tableCellClient, styles.headerText]}>NOM CLIENT</Text>
            <Text style={[styles.tableCell, styles.tableCellCommande, styles.headerText]}>NUMERO COMMANDE</Text>
            <Text style={[styles.tableCell, styles.tableCellMontant, styles.headerText]}>MONTANT TTC</Text>
            <Text style={[styles.tableCell, styles.tableCellMontant, styles.headerText]}>MONTANT HORS TAXE</Text>
            <Text style={[styles.tableCell, styles.tableCellDate, styles.headerText]}>DATE DE COMMANDE</Text>
            <Text style={[styles.tableCell, styles.tableCellEncours, styles.headerText]}>ENCOURS CLIENT</Text>
            <Text style={[styles.tableCell, styles.tableCellStatus, styles.headerText]}>STATUS</Text>
          </View>
          {validOrders.map((order, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={[styles.tableCell, styles.tableCellNumber]}>#{index + 1}</Text>
              <Text style={[styles.tableCell, styles.tableCellClient]}>{order.str_socname || "N/A"}</Text>
              <Text style={[styles.tableCell, styles.tableCellCommande]}>{order.lg_commid || "N/A"}</Text>
              <Text style={[styles.tableCell, styles.tableCellMontant]}>
                {formatPrice(order.dbl_commmtttc || 0)} FCFA
              </Text>
              <Text style={[styles.tableCell, styles.tableCellMontant]}>
                {formatPrice(order.dbl_commmtht || 0)} FCFA
              </Text>
              <Text style={[styles.tableCell, styles.tableCellDate]}>{order.dt_commcreated || "N/A"}</Text>
              <Text style={[styles.tableCell, styles.tableCellEncours]}>{order.clientEncours || "N/A"}</Text>
              <Text style={[styles.tableCell, styles.tableCellStatus]}>
                <Text
                  style={{
                    color: order.str_commstatut === "waiting" ? "#FFA500" : "#28a745",
                  }}
                >
                  {order.str_commstatut === "waiting" ? "EN ATTENTE" : "CLOTURÉ"}
                </Text>
              </Text>
            </View>
          ))}
        </View>

        {/* Totaux */}
        <View style={styles.totals}>
          <Text>Nombre total de commandes: {validOrders.length}</Text>
          <Text style={{ fontWeight: "bold" }}>
            Montant total TTC: {formatPrice(calculateTotal(validOrders, "dbl_commmtttc"))} FCFA
          </Text>
          <Text style={{ fontWeight: "bold" }}>
            Montant total HT: {formatPrice(calculateTotal(validOrders, "dbl_commmtht"))} FCFA
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>SN PROVECI - Importateur Grossiste</Text>
        </View>
      </Page>
    </Document>
  )
}

export default ListOrderPDF
