import AsyncStorage from "@react-native-async-storage/async-storage"
import { router } from "expo-router"
import React, { useState } from "react"
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native"
import { API_BASE_URL } from "../../constants/config"
import styles from "../styles/AdminLogin.styles"

// ===================================================
// ✅ Component: AdminLogin
// ===================================================
export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter both email and password")
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/Users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        Alert.alert("Login Failed", "Invalid email or password")
        return
      }

      const data = await response.json()

      if (data.role !== "Admin") {
        Alert.alert("Access Denied", "Only Admins can access this area")
        return
      }

      await AsyncStorage.setItem("adminToken", data.token)
      router.replace("../admin/dashboard")
    } catch (err) {
      console.error("Login error:", err)
      Alert.alert("Error", "Unable to connect to the server")
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.card}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/1828/1828504.png",
          }}
          style={styles.logo}
        />
        <Text style={styles.title}>Admin Dashboard Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("../")} style={styles.backBtn}>
          <Text style={styles.backText}>← Back to App</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}
