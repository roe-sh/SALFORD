import AsyncStorage from "@react-native-async-storage/async-storage"
import * as DocumentPicker from "expo-document-picker"
import { router } from "expo-router"
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
import styles from "../styles/AddLesson.styles"
import { Course } from "../types/models"

// ===================================================
// ✅ Component: AddLesson
// ===================================================
export default function AddLesson() {
  const [title, setTitle] = useState("")
  const [videoUri, setVideoUri] = useState<string | null>(null)
  const [duration, setDuration] = useState("")
  const [lessonOrder, setLessonOrder] = useState("")
  const [courseId, setCourseId] = useState<number | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/Courses`)
      if (!res.ok) throw new Error("Failed to load courses")
      const data = await res.json()
      setCourses(data)
    } catch (err) {
      console.error("Error loading courses:", err)
      Alert.alert("Error", "Could not load courses")
    }
  }

  const handlePickVideo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "video/*",
      })

      if (!result.canceled && result.assets && result.assets[0].uri) {
        setVideoUri(result.assets[0].uri)
        Alert.alert("🎥 Video Selected", result.assets[0].name)
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick a video file")
    }
  }

  const handleAddLesson = async () => {
    if (!title || !duration || !lessonOrder || !courseId || !videoUri) {
      Alert.alert("Missing Info", "Please fill all required fields and upload a video")
      return
    }

    try {
      setLoading(true)
      const token = await AsyncStorage.getItem("userToken")
      if (!token) {
        Alert.alert("Session expired", "Please log in again")
        return
      }

      const formData = new FormData()
      formData.append("title", title)
      formData.append("duration", duration)
      formData.append("lessonOrder", lessonOrder)
      formData.append("courseId", String(courseId))
      formData.append("videoFile", {
        uri: videoUri,
        name: "lesson.mp4",
        type: "video/mp4",
      } as any)

      const res = await fetch(`${API_BASE_URL}/admin/lessons/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to create lesson")

      Alert.alert("✅ Success", "Lesson added successfully", [
        { text: "OK", onPress: () => router.replace("/admin/lessons") },
      ])

      setTitle("")
      setVideoUri(null)
      setDuration("")
      setLessonOrder("")
      setCourseId(null)
    } catch (err) {
      console.error("Error adding lesson:", err)
      Alert.alert("❌ Error", "Could not add lesson")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>➕ Add Lesson</Text>
      <Text style={styles.subtitle}>Upload lesson video and details</Text>

      <TextInput
        style={styles.input}
        placeholder="Lesson Title"
        value={title}
        onChangeText={setTitle}
      />

      <TouchableOpacity style={styles.uploadBtn} onPress={handlePickVideo}>
        <Text style={styles.uploadText}>
          {videoUri ? "🎬 Change Video" : "📹 Upload Video File"}
        </Text>
      </TouchableOpacity>

      {videoUri && (
        <Text style={styles.fileName}>Selected: {videoUri.split("/").pop()}</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Duration (minutes)"
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Lesson Order (e.g. 1, 2, 3)"
        value={lessonOrder}
        onChangeText={setLessonOrder}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Select Course</Text>
      <View style={styles.courseBox}>
        {courses.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={[
              styles.courseItem,
              courseId === c.id && { backgroundColor: "#007F7F" },
            ]}
            onPress={() => setCourseId(c.id)}
          >
            <Text
              style={[
                styles.courseText,
                courseId === c.id && { color: "#fff" },
              ]}
            >
              {c.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleAddLesson}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Create Lesson</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  )
}
