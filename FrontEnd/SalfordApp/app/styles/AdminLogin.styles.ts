import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F6FA",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: 400,
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  logo: { width: 90, height: 90, marginBottom: 20 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 25,
    color: "#007F7F",
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#F7F9FB",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    padding: 14,
    marginBottom: 15,
    color: "#333",
    fontSize: 15,
  },
  button: {
    backgroundColor: "#007F7F",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  backBtn: { marginTop: 20 },
  backText: { color: "#6A5ACD", fontWeight: "600" },
})

export default styles
