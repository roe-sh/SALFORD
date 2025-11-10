import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007F7F",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007F7F",
    padding: 14,
    borderRadius: 10,
    marginTop: 25,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  toast: {
  position: "absolute",
  bottom: 40,
  left: 20,
  right: 20,
  backgroundColor: "#007F7F",
  borderRadius: 14,
  paddingVertical: 14,
  paddingHorizontal: 16,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 2 },
  elevation: 4,
},
toastEmoji: {
  fontSize: 22,
  marginRight: 8,
},
toastText: {
  color: "#fff",
  fontWeight: "600",
  fontSize: 15,
  textAlign: "center",
},

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  loginLink: { color: "#007F7F", fontWeight: "bold" },
})

export default styles
