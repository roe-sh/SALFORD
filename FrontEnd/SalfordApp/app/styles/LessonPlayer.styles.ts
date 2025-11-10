import { StyleSheet } from "react-native"

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  courseTitle: { fontSize: 16, color: "#888", marginBottom: 6 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 10 },
  video: {
    width: "100%",
    height: 240,
    backgroundColor: "#000",
    borderRadius: 12,
  },
  backButton: {
    marginTop: 20,
    backgroundColor: "#007F7F",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  backText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
})
