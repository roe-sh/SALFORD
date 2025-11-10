import { Link } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Welcome() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/welcome.png")} // replace with your artwork
        style={{ width: 250, height: 250 }}
        resizeMode="contain"
      />
      <Text style={styles.title}>Welcome to <Text style={{ color: "#007F7F" }}>SALFORD</Text></Text>
      <Text style={styles.subtitle}>
        Unlock the best IT courses for your career growth.
      </Text>

      <Link href="/onboarding/ob1" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#FFFFFF" },
  title: { fontSize: 26, fontWeight: "bold", marginTop: 30 },
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
