import { StyleSheet } from "react-native"

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  image: {
    width: 250,
    height: 250,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    color: "#000",
  },
  highlight: {
    color: "#007F7F",
  },
  subtitle: {
    textAlign: "center",
    color: "#777",
    marginTop: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007F7F",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginTop: 40,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
})
