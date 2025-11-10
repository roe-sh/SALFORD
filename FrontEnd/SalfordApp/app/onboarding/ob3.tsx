import { Link } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function OB3() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/ob3.png")}
        style={{ width: 250, height: 250 }}
        resizeMode="contain"
      />
      <Text style={styles.title}>
        Ready to dive into <Text style={styles.highlight}>Learning?</Text>
      </Text>
      <Text style={styles.subtitle}>
        Access courses on the go, anytime, from anywhere.
      </Text>

      <Link href="/screens/auth/login" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Start Learning</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginTop: 20 },
  highlight: { color: "#007F7F" },
  subtitle: { textAlign: "center", color: "#777", marginTop: 10, fontSize: 16 },
  button: {
    backgroundColor: "#007F7F",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginTop: 40,
  },
  buttonText: { color: "#FFF", fontWeight: "600", fontSize: 16 },
});
