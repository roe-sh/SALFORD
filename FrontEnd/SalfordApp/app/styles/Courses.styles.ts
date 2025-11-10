import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#222",
  },
  search: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 15,
    backgroundColor: "#FAFAFA",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  cardBody: { padding: 10 },
  title: { fontSize: 16, fontWeight: "600", color: "#222" },
  category: { color: "#777", fontSize: 14 },
  price: { fontWeight: "700", marginTop: 4, color: "#007F7F" },
})

export default styles
