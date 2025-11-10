import AsyncStorage from "@react-native-async-storage/async-storage"
import { router, useLocalSearchParams } from "expo-router"
import React, { useEffect, useState } from "react"
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from "react-native"
import { API_BASE_URL } from "../../../constants/config"
import styles from "../../styles/CourseLessonsPage.styles"
import { Lesson } from "../../types/models"

// ===================================================
// ✅ Component: CourseLessonsPage
// ===================================================
export default function CourseLessonsPage() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadLessons()
  }, [courseId])

  const loadLessons = async () => {
    try {
      setLoading(true)
      const token = await AsyncStorage.getItem("userToken")
      if (!token) {
        Alert.alert("Session expired", "Please log in again")
        return
      }

      const res = await fetch(`${API_BASE_URL}/admin/lessons?courseId=${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) throw new Error("Failed to load lessons")

      const data = await res.json()
      setLessons(data)
    } catch (err) {
      console.error("Error loading lessons:", err)
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

            if (!res.ok) throw new Error("Delete failed")
            Alert.alert("✅ Success", "Lesson deleted successfully")
            loadLessons()
          } catch (err) {
            console.error("Delete error:", err)
            Alert.alert("❌ Error", "Unable to delete lesson")
          }
        },
      },
    ])
  }

  const handleAddLesson = () => {
    router.push({
      pathname: "/admin/add-lesson" as const,
      params: { courseId: String(courseId) },
    })
  }

  const handleEditLesson = (id: number) => {
    router.push({
      pathname: "/admin/edit-lesson/[id]" as const,
      params: { id: String(id) },
    })
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
        <Text style={styles.title}>Lessons for Course #{courseId}</Text>
        <TouchableOpacity style={styles.addBtn} onPress={handleAddLesson}>
          <Text style={styles.addText}>➕ Add Lesson</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={lessons}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={loadLessons}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.lessonTitle}>{item.title}</Text>
              <Text style={styles.details}>
                ⏱ {item.duration} mins | 🎞 Order {item.lessonOrder}
              </Text>
              <Text style={styles.courseTitle}>
                📚 {item.courseTitle || "Unknown course"}
              </Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => handleEditLesson(item.id)}
                style={styles.editBtn}
              >
                <Text style={styles.btnText}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                style={styles.deleteBtn}
              >
                <Text style={styles.btnText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={{ color: "#777" }}>No lessons found</Text>
          </View>
        }
      />
    </View>
  )
}
