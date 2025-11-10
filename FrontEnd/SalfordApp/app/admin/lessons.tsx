import AsyncStorage from "@react-native-async-storage/async-storage"
import { router } from "expo-router"
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
import styles from "../styles/AdminLessons.styles"
import { Lesson } from "../types/models"

// ===================================================
// ✅ Component: AdminLessons
// ===================================================
export default function AdminLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadLessons()
  }, [])

  const loadLessons = async () => {
    try {
      setLoading(true)
      const token = await AsyncStorage.getItem("userToken")
      if (!token) {
        Alert.alert("Session expired", "Please log in again")
        return
      }

      const res = await fetch(`${API_BASE_URL}/admin/lessons`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) throw new Error("Failed to load lessons")
      const data = await res.json()
      setLessons(data)
    } catch (err) {
      console.error("Error:", err)
      Alert.alert("Error", "Unable to load lessons")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleDelete = async (id: number) => {
    Alert.alert("Confirm", "Delete this lesson?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("userToken")
            const res = await fetch(`${API_BASE_URL}/admin/lessons/${id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            })

            if (!res.ok) throw new Error("Failed to delete")
            Alert.alert("✅ Success", "Lesson deleted")
            loadLessons()
          } catch {
            Alert.alert("❌ Error", "Could not delete lesson")
          }
        },
      },
    ])
  }

  const handleRefresh = () => {
    setRefreshing(true)
    loadLessons()
  }

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007F7F" />
        <Text>Loading lessons...</Text>
      </View>
    )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎥 Lessons Management</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push("/admin/add-lesson")}
        >
          <Text style={styles.addText}>＋ Add Lesson</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={lessons}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.lessonTitle}>{item.title}</Text>
              <Text style={styles.course}>
                📘 {item.courseTitle} | ⏱ {item.duration} mins
              </Text>
              <Text style={styles.order}>Order #{item.lessonOrder}</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/admin/edit-lesson/[id]" as const,
                    params: { id: String(item.id) },
                  })
                }
              >
                <Text style={styles.edit}>✏️</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.delete}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>No lessons available</Text>
          </View>
        }
      />
    </View>
  )
}
