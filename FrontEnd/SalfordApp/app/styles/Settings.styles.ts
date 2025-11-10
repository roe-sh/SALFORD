import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { fontSize: 24, fontWeight: "700", marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 5, fontWeight: "500" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  value: { fontSize: 16, fontWeight: "600", color: "#555" },
  saveBtn: {
    backgroundColor: "#007F7F",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  logoutBtn: {
    backgroundColor: "#E53935",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 25,
  },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
})

export default styles
