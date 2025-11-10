import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF6F4",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    alignItems: "center",
    marginBottom: 25,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
  },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  name: { fontSize: 18, fontWeight: "700", color: "#222" },
  email: { color: "#777", fontSize: 14, marginTop: 2 },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  menuText: { fontSize: 16, fontWeight: "500", color: "#333" },
  arrow: { fontSize: 20, color: "#007F7F" },

  addButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007F7F",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  plus: { color: "#fff", fontSize: 32, fontWeight: "600", marginTop: -2 },
})

export default styles
