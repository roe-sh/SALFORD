import AsyncStorage from "@react-native-async-storage/async-storage"
import { router } from "expo-router"
import React, { useEffect, useState } from "react"
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
} from "react-native"
import { API_BASE_URL } from "../../constants/config"
import styles from "../styles/AdminCourses.styles"
import { Course } from "../types/models"

// ===================================================
// ✅ Component: AdminCourses
// ===================================================
export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      setLoading(true)
      const token = await AsyncStorage.getItem("userToken")
      if (!token) {
        Alert.alert("Session expired", "Please log in again")
        return
      }

      const res = await fetch(`${API_BASE_URL}/admin/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) throw new Error("Failed to load courses")

      const data = await res.json()
      setCourses(data)
    } catch (err) {
      console.error("Error loading courses:", err)
      Alert.alert("Error", "Unable to load courses")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    loadCourses()
  }

  const handleDelete = async (id: number) => {
    Alert.alert("Confirm", "Delete this course?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("userToken")
            const res = await fetch(`${API_BASE_URL}/admin/courses/${id}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            })
            if (!res.ok) throw new Error("Delete failed")
            Alert.alert("✅ Success", "Course deleted successfully")
            loadCourses()
          } catch (err) {
            console.error("Delete course error:", err)
            Alert.alert("❌ Error", "Unable to delete course")
          }
        },
      },
    ])
  }

  const handleViewLessons = (courseId: number) => {
    router.push({
      pathname: "/admin/lessons/[courseId]" as const,
      params: { courseId: String(courseId) },
    })
  }

  const handleAddLesson = (courseId: number) => {
    router.push({
      pathname: "/admin/add-lesson",
      params: { courseId: String(courseId) },
    })
  }

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007F7F" />
        <Text>Loading courses...</Text>
      </View>
    )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Courses</Text>
      <Text style={styles.subtitle}>Manage existing courses</Text>

      <FlatList
        data={courses}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={
                item.imageUrl
                  ? { uri: item.imageUrl }
                  : require("../../assets/images/default-course.png")
              }
              style={styles.image}
            />

            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.courseTitle}>{item.title}</Text>
              <Text style={styles.category}>{item.categoryName}</Text>
              <Text numberOfLines={2} style={styles.description}>
                {item.description}
              </Text>
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.smallBtn, { backgroundColor: "#007F7F" }]}
                  onPress={() => handleViewLessons(item.id)}
                >
                  <Text style={styles.btnText}>📖 View Lessons</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.smallBtn, { backgroundColor: "#6A5ACD" }]}
                  onPress={() => handleAddLesson(item.id)}
                >
                  <Text style={styles.btnText}>➕ Add Lesson</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDelete(item.id)}
            >
              <Text style={styles.deleteText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={{ color: "#777" }}>No courses found</Text>
          </View>
        }
      />
    </View>
  )
}
