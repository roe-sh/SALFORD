import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFB", padding: 20 },
  title: { fontSize: 22, fontWeight: "700", color: "#007F7F" },
  subtitle: { color: "#555", marginBottom: 15 },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  image: { width: 70, height: 70, borderRadius: 10 },
  courseTitle: { fontWeight: "700", fontSize: 16, color: "#333" },
  category: { color: "#6A5ACD", fontSize: 13, marginBottom: 3 },
  description: { fontSize: 13, color: "#555", marginBottom: 4 },
  price: { fontWeight: "700", color: "#007F7F" },
  deleteBtn: { padding: 8 },
  deleteText: { fontSize: 18 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  actionRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  smallBtn: {
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  btnText: { color: "#fff", fontSize: 13, fontWeight: "600" },
})

export default styles
