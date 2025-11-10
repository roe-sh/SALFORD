import { Link, router } from "expo-router"
import React, { useState } from "react"
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import Toast from "../../../components/ui/Toast"
import { API_BASE_URL } from "../../../constants/config"
import { useToast } from "../../../hooks/useToast"
import styles from "../../styles/Signup.styles"
import { UserProfile } from "../../types/models"

// ===================================================
// ✅ Hook: useSignup — reusable registration handler
// ===================================================
function useSignup() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const register = async (
    fullName: string,
    email: string,
    password: string
  ): Promise<UserProfile> => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch(`${API_BASE_URL}/Users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok)
        throw new Error(data.message || `Registration failed (${res.status})`)

      return data as UserProfile
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { register, loading, error }
}

// ===================================================
// ✅ Component: Signup
// ===================================================
export default function Signup() {
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")

  const { register, loading } = useSignup()
  const { visible, message, emoji, showToast, hideToast, duration } = useToast()

  // ===================================================
  // 🧠 Signup handler
  // ===================================================
  const handleSignup = async () => {
    if (!email || !password || !confirm || !fullName) {
      alert("Please fill in all fields")
      return
    }
    if (password !== confirm) {
      alert("Passwords do not match")
      return
    }

    try {
      const data = await register(fullName, email, password)
      showToast(`Welcome ${data.fullName || "User"}! 🎊`, "🎉")

      setTimeout(() => {
        router.replace("/screens/auth/login")
      }, duration)
    } catch (err: any) {
      alert(`Registration Failed: ${err.message}`)
    }
  }

  // ===================================================
  // 🖼️ UI Layout
  // ===================================================
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign up</Text>
      <Text style={styles.subtitle}>Create a new account below</Text>

      <TextInput
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
      />

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

      <TextInput
        placeholder="Confirm password"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
        style={styles.input}
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign up</Text>
        )}
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text>Joined us before?</Text>
        <Link href="/screens/auth/login" asChild>
          <TouchableOpacity>
            <Text style={styles.loginLink}> Sign In</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* ✅ Shared Toast Component */}
      <Toast
        visible={visible}
        message={message}
        emoji={emoji}
        onHide={hideToast}
      />
    </View>
  )
}
