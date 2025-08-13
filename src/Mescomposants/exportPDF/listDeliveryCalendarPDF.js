import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"

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
    width: "8%",
  },
  tableCellZone: {
    width: "25%",
    textAlign: "left",
  },
  tableCellDate: {
    width: "20%",
    textAlign: "left",
  },
  tableCellCount: {
    width: "15%",
    textAlign: "center",
  },
  tableCellStatus: {
    width: "12%",
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

const ListDeliveryCalendarPDF = ({ deliveryCalendars }) => {
  // Vérification que deliveryCalendars est bien un tableau
  const validCalendars = Array.isArray(deliveryCalendars) ? deliveryCalendars : []

  // Fonction pour formater les dates
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("fr-FR")
    } catch (error) {
      return dateString
    }
  }

  // Fonction pour calculer le total des commandes
  const calculateTotalCommands = (calendars) => {
    return calendars.reduce((total, calendar) => {
      const count = Number.parseInt(calendar.cmd_count || 0)
      return isNaN(count) ? total : total + count
    }, 0)
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête */}
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

        <Text style={styles.title}>Calendriers de Livraison</Text>
        <Text
          style={{
            fontSize: 8,
            textAlign: "right",
            marginBottom: 10,
          }}
        >
          Date d'exportation: {new Date().toLocaleDateString("fr-FR")}
        </Text>

        {/* Tableau des calendriers de livraison */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.headerRow]}>
            <Text style={[styles.tableCell, styles.tableCellNumber, styles.headerText]}>#</Text>
            <Text style={[styles.tableCell, styles.tableCellZone, styles.headerText]}>ZONE DE LIVRAISON</Text>
            <Text style={[styles.tableCell, styles.tableCellDate, styles.headerText]}>DATE DÉBUT</Text>
            <Text style={[styles.tableCell, styles.tableCellDate, styles.headerText]}>DATE FIN</Text>
            <Text style={[styles.tableCell, styles.tableCellCount, styles.headerText]}>NB COMMANDES</Text>
            <Text style={[styles.tableCell, styles.tableCellStatus, styles.headerText]}>STATUT</Text>
          </View>
          {validCalendars.map((calendar, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={[styles.tableCell, styles.tableCellNumber]}>#{index + 1}</Text>
              <Text style={[styles.tableCell, styles.tableCellZone]}>{calendar.zone || "N/A"}</Text>
              <Text style={[styles.tableCell, styles.tableCellDate]}>{formatDate(calendar.dt_livbegin)}</Text>
              <Text style={[styles.tableCell, styles.tableCellDate]}>{formatDate(calendar.dt_livend)}</Text>
              <Text style={[styles.tableCell, styles.tableCellCount]}>{calendar.cmd_count || "0"}</Text>
              <Text style={[styles.tableCell, styles.tableCellStatus]}>
                <Text
                  style={{
                    color: calendar.str_livstatut === "closed" ? "#28a745" : "#FFA500",
                  }}
                >
                  {calendar.str_livstatut === "closed" ? "FERMÉ" : "OUVERT"}
                </Text>
              </Text>
            </View>
          ))}
        </View>

        {/* Totaux */}
        <View style={styles.totals}>
          <Text>Nombre total de calendriers: {validCalendars.length}</Text>
          <Text style={{ fontWeight: "bold" }}>Total des commandes: {calculateTotalCommands(validCalendars)}</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>SN PROVECI - Importateur Grossiste</Text>
        </View>
      </Page>
    </Document>
  )
}

export default ListDeliveryCalendarPDF
