import { StyleSheet } from "react-native"

export default StyleSheet.create({
  container: { backgroundColor: "#F8FAFB", padding: 20 },
  title: { fontSize: 22, fontWeight: "700", color: "#007F7F", marginBottom: 5 },
  subtitle: { color: "#555", marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  label: { fontWeight: "600", marginTop: 10, marginBottom: 8 },
  courseBox: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  courseItem: {
    backgroundColor: "#E6F4F4",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  courseText: { color: "#007F7F", fontWeight: "500" },
  uploadBtn: {
    backgroundColor: "#E6F4F4",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 8,
  },
  uploadText: { color: "#007F7F", fontWeight: "600" },
  fileName: { fontSize: 13, color: "#555", marginBottom: 12 },
  button: {
    backgroundColor: "#007F7F",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
})
