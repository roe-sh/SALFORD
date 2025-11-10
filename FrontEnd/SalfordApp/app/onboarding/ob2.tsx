import { Link } from "expo-router"
import { Image, Text, TouchableOpacity, View } from "react-native"
import styles from "../styles/OB2.styles"

// ===================================================
// ✅ Component: OB2 — Onboarding Screen 2
// ===================================================
export default function OB2() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/ob2.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>
        Learn on your own <Text style={{ color: "#007F7F" }}>Schedule</Text>
      </Text>

      <Text style={styles.subtitle}>
        Access courses anytime anywhere on the go.
      </Text>

      <View style={styles.navigation}>
        <Link href="/onboarding/welcome">
          <Text style={styles.skip}>Skip</Text>
        </Link>

        <Link href="/screens/auth/login" asChild>
          <TouchableOpacity>
            <Text style={styles.next}>Next →</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  )
}
