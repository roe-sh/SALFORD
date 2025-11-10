import AsyncStorage from "@react-native-async-storage/async-storage"
import { router } from "expo-router"
import React, { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { API_BASE_URL } from "../../constants/config"
import styles from "../styles/Settings.styles"
import { UserProfile } from "../types/models"

// ===================================================
// ✅ Component: SettingsPage
// ===================================================
export default function SettingsPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [themeDark, setThemeDark] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editingName, setEditingName] = useState("")
  const [newPassword, setNewPassword] = useState("")

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken")
      if (!token) {
        router.push("/screens/auth/login")
        return
      }
      const res = await fetch(`${API_BASE_URL}/Users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setUser(data)
      setEditingName(data.fullName)
    } catch (err) {
      console.error("Error loading profile:", err)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async () => {
    if (!user) return
    try {
      const token = await AsyncStorage.getItem("userToken")
      const res = await fetch(`${API_BASE_URL}/Users/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: editingName,
          newPassword: newPassword || undefined,
        }),
      })
      if (res.ok) {
        Alert.alert("✅ Success", "Profile updated successfully")
        loadProfile()
      } else {
        Alert.alert("⚠️ Failed", "Unable to update profile")
      }
    } catch (err) {
      console.error("Profile update error:", err)
    }
  }

  const logout = async () => {
    await AsyncStorage.removeItem("userToken")
    router.replace("/screens/auth/login")
  }

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007F7F" />
        <Text>Loading profile...</Text>
      </View>
    )

  if (!user)
    return (
      <View style={styles.center}>
        <Text>No user data found</Text>
      </View>
    )

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Profile Settings ⚙️</Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        value={editingName}
        onChangeText={setEditingName}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={user.email} editable={false} />

      <Text style={styles.label}>New Password</Text>
      <TextInput
        style={styles.input}
        value={newPassword}
        secureTextEntry
        onChangeText={setNewPassword}
        placeholder="Leave blank to keep current"
      />

      <TouchableOpacity style={styles.saveBtn} onPress={updateProfile}>
        <Text style={styles.saveText}>💾 Save Changes</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.label}>Dark Mode 🌙</Text>
        <Switch value={themeDark} onValueChange={setThemeDark} />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Role</Text>
        <Text style={styles.value}>{user.role}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Subscription</Text>
        <Text style={styles.value}>
          {user.subscriptionStatus || "No Active Subscription"}
        </Text>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}
