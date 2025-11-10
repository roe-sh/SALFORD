import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8FAFB",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#007F7F",
  },
  subtitle: {
    color: "#555",
    marginBottom: 15,
  },
  label: {
    fontWeight: "600",
    marginTop: 10,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  categoryBox: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  categoryItem: {
    backgroundColor: "#E6F4F4",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  categoryText: { color: "#007F7F", fontWeight: "500" },
  button: {
    backgroundColor: "#007F7F",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  uploadBtn: {
  backgroundColor: "#E6F4F4",
  paddingVertical: 10,
  borderRadius: 10,
  alignItems: "center",
  marginBottom: 10,
},
uploadText: { color: "#007F7F", fontWeight: "600" },
previewImage: {
  width: "100%",
  height: 200,
  borderRadius: 10,
  marginBottom: 15,
},

})

export default styles
