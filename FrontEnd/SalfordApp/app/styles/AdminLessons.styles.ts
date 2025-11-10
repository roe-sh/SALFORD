import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFB", padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  title: { fontSize: 22, fontWeight: "700", color: "#007F7F" },
  addBtn: {
    backgroundColor: "#007F7F",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  addText: { color: "#fff", fontWeight: "600" },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  lessonTitle: { fontSize: 16, fontWeight: "700", color: "#333" },
  course: { color: "#666", marginVertical: 4 },
  order: { fontSize: 12, color: "#999" },
  actions: { flexDirection: "row", alignItems: "center", gap: 10 },
  edit: { fontSize: 18 },
  delete: { fontSize: 18 },
})

export default styles
