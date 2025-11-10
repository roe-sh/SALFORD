import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFB", padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#007F7F",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#FFF",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007F7F",
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  buttonText: { color: "#FFF", fontWeight: "700", fontSize: 16 },
  card: {
    padding: 14,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  categoryText: { fontSize: 16, fontWeight: "600", color: "#333" },
})

export default styles
