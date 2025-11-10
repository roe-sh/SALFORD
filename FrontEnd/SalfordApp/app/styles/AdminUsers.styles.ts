import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFB", padding: 20 },
  title: { fontSize: 22, fontWeight: "700", color: "#007F7F" },
  subtitle: { color: "#555", marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  name: { fontSize: 16, fontWeight: "700", color: "#333" },
  email: { color: "#777", fontSize: 14 },
  role: { marginTop: 5, fontWeight: "600" },
  actions: { flexDirection: "row", gap: 8 },
  btn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  btnText: { color: "#fff", fontWeight: "600" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
})

export default styles
