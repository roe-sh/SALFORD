import { router } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function Splash() {
  useEffect(() => {
    const timer = setTimeout(() => router.replace("/onboarding/welcome"), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/owl.png")}
        style={{ width: 120, height: 120 }}
        resizeMode="contain"
      />
      <Text style={styles.title}>SALFORD</Text>
      <Text style={styles.subtitle}>Best Education For You</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#E6F2F2" },
  title: { fontSize: 32, fontWeight: "bold", color: "#006666", marginTop: 20 },
  subtitle: { fontSize: 16, color: "#006666", marginTop: 6 },
});
