import { LinearGradient } from "expo-linear-gradient"
import React, { useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { API_BASE_URL } from "../../constants/config"
import styles from "../styles/Subscription.styles"

// ===================================================
// Hook: useSubscribe
// ===================================================
function useSubscribe() {
  const [loading, setLoading] = useState(false)

  const subscribe = async (planName: string, amount: number) => {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE_URL}/payments/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseTitle: planName, amount }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.sessionUrl) {
        throw new Error(data?.message || "Failed to create checkout session")
      }

      await Linking.openURL(data.sessionUrl)
    } catch (err) {
      console.error(err)
      Alert.alert("Error", "Unable to start checkout session")
    } finally {
      setLoading(false)
    }
  }

  return { subscribe, loading }
}

// ===================================================
// Component: SubscriptionPage
// ===================================================
export default function SubscriptionPage() {
  const { subscribe, loading } = useSubscribe()

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 24, paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.header}>Subscription Plans</Text>
      <Text style={styles.subHeader}>
        Choose The Right Plan For Your Learning Journey.
      </Text>

      {/* Basic Plan */}
      <View style={styles.planCard}>
        <View>
          <Text style={styles.planTitle}>Basic Plan</Text>
          <Text style={styles.planDescription}>
            Unlock Essential Courses And Features.
          </Text>
        </View>
        <View style={styles.priceWrapper}>
          <Text style={styles.price}>$9.99</Text>
          <Text style={styles.period}>Monthly</Text>
        </View>
      </View>

      {/* Pro Plan */}
      <View style={styles.planCard}>
        <View>
          <Text style={styles.planTitle}>Pro Plan</Text>
          <Text style={styles.planDescription}>
            Get Certificates And Offline Access.
          </Text>
        </View>
        <View style={styles.priceWrapper}>
          <Text style={styles.price}>$19.99</Text>
          <Text style={styles.period}>Monthly</Text>
        </View>
      </View>

      {/* Premium Plan */}
      <LinearGradient
        colors={["#005F73", "#0A9396"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.premiumCard}
      >
        <View style={{ marginBottom: 20 }}>
          <Text style={[styles.planTitle, { color: "#fff" }]}>Premium Plan</Text>
          <Text style={[styles.planDescription, { color: "#E0F2F1" }]}>
            Exclusive Content And VIP Support.
          </Text>
        </View>

        <View style={{ marginBottom: 15 }}>
          {[
            "Access To All Courses",
            "Certification On Completion",
            "Offline Access",
            "Premium Support",
            "Exclusive Content",
          ].map((item, i) => (
            <View key={i} style={styles.featureItem}>
              <Text style={styles.check}>✔</Text>
              <Text style={styles.featureText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.premiumFooter}>
          <View style={styles.priceWrapper}>
            <Text style={[styles.price, { color: "#fff" }]}>$29.99</Text>
            <Text style={[styles.period, { color: "#E0F2F1" }]}>Monthly</Text>
          </View>

          <TouchableOpacity
            style={styles.subscribeButton}
            onPress={() => subscribe("Premium Plan", 29.99)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.subscribeText}>Subscribe Now</Text>
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <Text style={styles.note}>
        💳 Use Stripe test card number 4242 4242 4242 4242 — any expiry & CVC
      </Text>
    </ScrollView>
  )
}
