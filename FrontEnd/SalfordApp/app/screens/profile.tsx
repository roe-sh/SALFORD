import AsyncStorage from "@react-native-async-storage/async-storage"
import { router } from "expo-router"
import React, { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { API_BASE_URL } from "../../constants/config"
import styles from "../styles/Profile.styles"
import { UserProfile } from "../types/models"

// ===================================================
// ✅ Component: Profile
// ===================================================
export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken")
      if (!token) {
        Alert.alert("Not logged in", "Please sign in first.")
        router.replace("/screens/auth/login")
        return
      }

      const res = await fetch(`${API_BASE_URL}/Users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) throw new Error("Failed to load profile")

      const data = await res.json()
      setProfile(data)
    } catch (err) {
      console.error(err)
      Alert.alert("Error", "Could not load profile.")
    } finally {
      setLoading(false)
    }
  }

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007F7F" />
        <Text style={{ marginTop: 8 }}>Loading...</Text>
      </View>
    )

  if (!profile) return null

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile</Text>
      </View>

      {/* PROFILE CARD */}
      <View style={styles.profileCard}>
        <Image
          source={{
            uri: "https://i.pravatar.cc/150?img=8",
          }}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.name}>{profile.fullName}</Text>
          <Text style={styles.email}>{profile.email}</Text>
        </View>
      </View>

      {/* MENU LIST */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => router.push("/screens/my-courses")}
      >
        <Text style={styles.menuText}>Your Current Courses</Text>
        <Text style={styles.arrow}>➜</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => router.push("/screens/history")}
      >
        <Text style={styles.menuText}>Your History</Text>
        <Text style={styles.arrow}>➜</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => router.push("/screens/certifications")}
      >
        <Text style={styles.menuText}>Certifications Earned</Text>
        <Text style={styles.arrow}>➜</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => router.push("/screens/settings")}
      >
        <Text style={styles.menuText}>Settings</Text>
        <Text style={styles.arrow}>➜</Text>
      </TouchableOpacity>

      {/* FLOATING ADD BUTTON */}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.plus}>＋</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}
