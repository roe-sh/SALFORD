import AsyncStorage from "@react-native-async-storage/async-storage"
import { router, useLocalSearchParams } from "expo-router"
import React, { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { API_BASE_URL } from "../../constants/config"
import styles from "../styles/EditProfile.styles"
import { UserProfile } from "../types/models"

// ===================================================
// ✅ Component: EditProfile
// ===================================================
export default function EditProfile() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken")
      if (!token) {
        Alert.alert("Not logged in", "Please sign in first.")
        router.replace("/screens/auth/login")
        return
      }

      const res = await fetch(`${API_BASE_URL}/Users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) throw new Error("Failed to fetch user data")
      const data = await res.json()
      setProfile(data)
    } catch (err) {
      console.error("Profile fetch error:", err)
      Alert.alert("Error", "Could not load profile")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!profile) return

    try {
      setSaving(true)
      const token = await AsyncStorage.getItem("userToken")
      if (!token) throw new Error("No token found")

      const res = await fetch(`${API_BASE_URL}/Users/${profile.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: profile.id,
          fullName: profile.fullName,
          email: profile.email,
          passwordHash: "", 
          role: profile.role,
          subscriptionStatus: profile.subscriptionStatus,
          createdAt: new Date().toISOString(),
        }),
      })

      if (!res.ok) throw new Error("Failed to save changes")

      Alert.alert("Success", "Profile updated successfully", [
        { text: "OK", onPress: () => router.back() },
      ])
    } catch (err) {
      console.error("Save error:", err)
      Alert.alert("Error", "Could not update profile")
    } finally {
      setSaving(false)
    }
  }

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007F7F" />
        <Text style={{ marginTop: 10 }}>Loading user...</Text>
      </View>
    )

  if (!profile) return null

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Edit Profile ✏️</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={profile.fullName}
          onChangeText={(t) => setProfile({ ...profile, fullName: t })}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={profile.email}
          onChangeText={(t) => setProfile({ ...profile, email: t })}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Role</Text>
        <TextInput
          style={[styles.input, { backgroundColor: "#f0f0f0" }]}
          value={profile.role}
          editable={false}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Subscription</Text>
        <TextInput
          style={styles.input}
          value={profile.subscriptionStatus || ""}
          onChangeText={(t) =>
            setProfile({ ...profile, subscriptionStatus: t })
          }
        />
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#007F7F" }]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save Changes 💾</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#ccc" }]}
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}
