import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { useState } from "react"
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
import styles from "../styles/AddUser.styles"

// ===================================================
// ✅ Component: AddUser
// ===================================================
export default function AddUser() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"Admin" | "Student">("Student")
  const [loading, setLoading] = useState(false)

  const handleAddUser = async () => {
    if (!fullName || !email || !password) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    try {
      setLoading(true)
      const token = await AsyncStorage.getItem("userToken")
      if (!token) {
        Alert.alert("Session expired", "Please log in again")
        return
      }

      const res = await fetch(`${API_BASE_URL}/admin/users/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName, email, password, role }),
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(errorText || "Failed to create user")
      }

      const data = await res.json()
      Alert.alert("✅ Success", data.message || "User added successfully")

      // reset form
      setFullName("")
      setEmail("")
      setPassword("")
      setRole("Student")
    } catch (err: any) {
      console.error("Add user error:", err)
      Alert.alert("❌ Error", err.message || "Unable to create user")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>➕ Add New User</Text>
      <Text style={styles.subtitle}>Create a new admin or student account</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[
            styles.roleButton,
            role === "Student" && styles.activeRoleButton,
          ]}
          onPress={() => setRole("Student")}
        >
          <Text
            style={[styles.roleText, role === "Student" && styles.activeRoleText]}
          >
            Student
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleButton,
            role === "Admin" && styles.activeRoleButton,
          ]}
          onPress={() => setRole("Admin")}
        >
          <Text
            style={[styles.roleText, role === "Admin" && styles.activeRoleText]}
          >
            Admin
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleAddUser}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Create User</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  )
}
