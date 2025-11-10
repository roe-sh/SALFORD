import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFB" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  banner: { width: "100%", height: 200, resizeMode: "cover" },
  infoSection: { padding: 20 },
  title: { fontSize: 22, fontWeight: "700", color: "#007F7F" },
  category: { fontSize: 14, color: "#777", marginVertical: 4 },
  price: { fontSize: 16, fontWeight: "700", color: "#333", marginBottom: 10 },
  description: { fontSize: 15, color: "#555", marginBottom: 20 },
  button: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  lessonsSection: { padding: 20 },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: "#007F7F",
    marginBottom: 10,
  },
  lessonCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  lessonOrder: { color: "#6A5ACD", fontWeight: "600" },
  lessonTitle: { fontSize: 16, fontWeight: "600", color: "#222" },
  lessonDuration: { fontSize: 13, color: "#777", marginTop: 3 },
})

export default styles
