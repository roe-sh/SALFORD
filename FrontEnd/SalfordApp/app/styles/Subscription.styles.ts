import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FCFCFC" },
  header: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  subHeader: {
    textAlign: "center",
    color: "#666",
    fontSize: 15,
    marginBottom: 30,
  },
  planCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  planTitle: { fontSize: 18, fontWeight: "700", color: "#1E1E1E" },
  planDescription: { color: "#777", fontSize: 14, marginTop: 4, maxWidth: 180 },
  priceWrapper: { alignItems: "flex-end" },
  price: { fontSize: 22, fontWeight: "700", color: "#007F7F" },
  period: { color: "#999", fontSize: 13 },
  premiumCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  check: { color: "#B2FF59", fontSize: 16, marginRight: 8 },
  featureText: { color: "#fff", fontSize: 14 },
  premiumFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  subscribeButton: {
    backgroundColor: "#EE9B00",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  subscribeText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  note: {
    color: "#777",
    fontSize: 13,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 30,
  },
})

export default styles
