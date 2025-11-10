import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFB",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#007F7F",
    marginBottom: 4,
  },
  subtitle: {
    color: "#666",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#FFF",
    marginBottom: 15,
  },
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  roleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#007F7F",
    borderRadius: 10,
    paddingVertical: 12,
    marginHorizontal: 5,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  activeRoleButton: {
    backgroundColor: "#007F7F",
  },
  roleText: {
    color: "#007F7F",
    fontWeight: "600",
  },
  activeRoleText: {
    color: "#fff",
  },
  button: {
    backgroundColor: "#007F7F",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
})

export default styles
