import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", padding: 20 },
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: "#007F7F",
    textAlign: "center",
    marginVertical: 20,
  },
  formGroup: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: "600", color: "#666" },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginTop: 6,
    fontSize: 16,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
})

export default styles
