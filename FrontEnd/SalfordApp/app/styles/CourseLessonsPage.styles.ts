import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFB", padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 20, fontWeight: "700", color: "#007F7F" },
  addBtn: {
    backgroundColor: "#007F7F",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  addText: { color: "#fff", fontWeight: "600" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  lessonTitle: { fontSize: 16, fontWeight: "700", color: "#333" },
  details: { color: "#777", fontSize: 13, marginVertical: 2 },
  courseTitle: { color: "#6A5ACD", fontSize: 13 },
  actions: { flexDirection: "row", gap: 8 },
  editBtn: {
    backgroundColor: "#6A5ACD",
    padding: 8,
    borderRadius: 6,
  },
  deleteBtn: {
    backgroundColor: "#E53935",
    padding: 8,
    borderRadius: 6,
  },
  btnText: { color: "#fff", fontWeight: "700" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
})

export default styles
