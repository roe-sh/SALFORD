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
  subtitle: {
    textAlign: "center",
    color: "#777",
    marginTop: 10,
    fontSize: 16,
  },
  navigation: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 50,
  },
  skip: { color: "#777", fontSize: 16 },
  next: { color: "#007F7F", fontWeight: "600", fontSize: 16 },
})
