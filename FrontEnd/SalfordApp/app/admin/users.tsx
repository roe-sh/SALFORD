import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { useEffect, useState } from "react"
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
} from "react-native"
import { API_BASE_URL } from "../../constants/config"
import styles from "../styles/AdminUsers.styles"
import { User } from "../types/models"

// ===================================================
// ✅ Component: AdminUsers
// ===================================================
export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const token = await AsyncStorage.getItem("userToken")
      if (!token) {
        Alert.alert("Session expired", "Please log in again")
        return
      }

      const res = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) throw new Error("Failed to fetch users")

      const data = await res.json()
      setUsers(data)
    } catch (err) {
      console.error("Error:", err)
      Alert.alert("Error", "Unable to load users")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    loadUsers()
  }

  const handleDelete = async (id: number) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this user?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("userToken")
            const res = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            })

            if (!res.ok) throw new Error("Delete failed")
            Alert.alert("✅ Success", "User deleted successfully")
            loadUsers()
          } catch (err) {
            Alert.alert("❌ Error", "Unable to delete user")
          }
        },
      },
    ])
  }

  const handleToggleRole = async (id: number, currentRole: string) => {
    const newRole = currentRole === "Admin" ? "Student" : "Admin"
    try {
      const token = await AsyncStorage.getItem("userToken")
      const res = await fetch(`${API_BASE_URL}/admin/users/update-role/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newRole),
      })

      if (!res.ok) throw new Error("Failed to update role")

      Alert.alert("✅ Role Updated", `User role changed to ${newRole}`)
      loadUsers()
    } catch (err) {
      Alert.alert("❌ Error", "Unable to update role")
    }
  }

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007F7F" />
        <Text>Loading users...</Text>
      </View>
    )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👥 All Users</Text>
      <Text style={styles.subtitle}>Manage all registered users</Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.fullName}</Text>
              <Text style={styles.email}>{item.email}</Text>
              <Text
                style={[
                  styles.role,
                  { color: item.role === "Admin" ? "#007F7F" : "#6A5ACD" },
                ]}
              >
                {item.role}
              </Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#6A5ACD" }]}
                onPress={() => handleToggleRole(item.id, item.role)}
              >
                <Text style={styles.btnText}>
                  {item.role === "Admin" ? "Demote" : "Promote"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#E53935" }]}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={{ color: "#777" }}>No users found</Text>
          </View>
        }
      />
    </View>
  )
}
