import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function Index() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/onboarding/splash");
    }, 1000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007F7F" />
      <Text style={styles.text}>Welcome to SalfordApp 🎓</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 18, fontWeight: "500", marginTop: 15, color: "#007F7F" },
});
