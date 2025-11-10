import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8FAFB" },
  title: { fontSize: 24, fontWeight: "700", color: "#007F7F", marginBottom: 5 },
  subtitle: { color: "#555", marginBottom: 20 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    paddingVertical: 30,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardValue: { fontSize: 26, fontWeight: "800", color: "#222" },
  cardLabel: { fontSize: 15, color: "#555", marginTop: 5 },
  overviewBox: {
    marginTop: 15,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#007F7F",
    marginBottom: 10,
  },
  overviewText: { fontSize: 15, color: "#333", marginBottom: 6 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
})

export default styles
