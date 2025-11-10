import { Link } from "expo-router"
import { Image, Text, TouchableOpacity, View } from "react-native"
import styles from "../styles/OB1.styles"

// ===================================================
// ✅ Component: OB1 — Onboarding Screen 1
// ===================================================
export default function OB1() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/ob1.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>
        Explore a wide range of{" "}
        <Text style={{ color: "#007F7F" }}>IT Courses</Text>
      </Text>

      <Text style={styles.subtitle}>
        From coding to cybersecurity, we have it all!
      </Text>

      <View style={styles.navigation}>
        <Link href="/onboarding/welcome">
          <Text style={styles.skip}>Skip</Text>
        </Link>

        <Link href="/onboarding/ob2" asChild>
          <TouchableOpacity>
            <Text style={styles.next}>Next →</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  )
}
