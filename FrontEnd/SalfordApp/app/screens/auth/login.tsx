import AsyncStorage from "@react-native-async-storage/async-storage"
import { Link, router } from "expo-router"
import React, { useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { API_BASE_URL } from "../../../constants/config"
import styles from "../../styles/Login.styles"
import { UserProfile } from "../../types/models"

// ===================================================
// ✅ Hook: useLogin — reusable pattern
// ===================================================
function useLogin() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (email: string, password: string): Promise<UserProfile> => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch(`${API_BASE_URL}/Users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || "Invalid credentials")
      if (!data.token || !data.role) throw new Error("Incomplete response")

      await AsyncStorage.setItem("userToken", data.token)
      await AsyncStorage.setItem("userInfo", JSON.stringify(data))
      return data as UserProfile
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { login, loading, error }
}

// ===================================================
// ✅ Component: Login
// ===================================================
export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)
  const [successVisible, setSuccessVisible] = useState(false)
  const [role, setRole] = useState<"Student" | "Admin" | null>(null)

  const { login, loading } = useLogin()

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password")
      return
    }

    try {
      const user = await login(email, password)
      setRole(user.role as "Student" | "Admin")
      setSuccessVisible(true)
    } catch (err: any) {
      Alert.alert("Login Failed", err.message)
    }
  }

  const handleSuccessRedirect = async () => {
    setSuccessVisible(false)
    const token = (await AsyncStorage.getItem("userToken")) || ""
    if (role === "Admin") {
      await AsyncStorage.setItem("adminToken", token)
      router.replace("/admin/Dashboard")
    } else {
      router.replace("../home")
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Enter your details to log in</Text>

      <TextInput
        placeholder="abc@email.com"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Enter your password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <View style={styles.row}>
        <View style={styles.rememberRow}>
          <Switch value={remember} onValueChange={setRemember} />
          <Text style={styles.rememberText}>Remember Me</Text>
        </View>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <Text style={{ marginVertical: 15, color: "#777" }}>Or</Text>

      <TouchableOpacity style={styles.googleButton}>
        <Image
          source={require("../../../assets/images/google.png")}
          style={styles.icon}
        />
        <Text>Sign in with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.appleButton}>
        <Image
          source={require("../../../assets/images/apple.png")}
          style={styles.icon}
        />
        <Text style={{ color: "#fff" }}>Sign in with Apple</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text>Don’t have an account?</Text>
        <Link href="/screens/auth/signup" asChild>
          <TouchableOpacity>
            <Text style={styles.signupLink}> Sign Up</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* ✅ Success Modal */}
      <Modal visible={successVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.card}>
            <View style={styles.iconWrapper}>
              <Text style={styles.iconEmoji}>✅</Text>
            </View>
            <Text style={styles.successTitle}>Login Successful!</Text>
            <Text style={styles.successSubtitle}>
              {role === "Admin"
                ? "Welcome back, Admin 👑"
                : "Your account is ready. Enjoy learning 🎓"}
            </Text>

            <TouchableOpacity
              style={styles.successButton}
              onPress={handleSuccessRedirect}
            >
              <Text style={styles.successButtonText}>
                {role === "Admin" ? "Go to Dashboard" : "Go to Home"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}
