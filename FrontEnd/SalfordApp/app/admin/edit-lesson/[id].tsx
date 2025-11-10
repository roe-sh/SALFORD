import AsyncStorage from "@react-native-async-storage/async-storage"
import * as DocumentPicker from "expo-document-picker"
import { router, useLocalSearchParams } from "expo-router"
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
import { API_BASE_URL } from "../../../constants/config"
import styles from "../../styles/EditLesson.styles"
import { Course, Lesson } from "../../types/models"

// ===================================================
// ✅ Component: EditLesson
// ===================================================
export default function EditLesson() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [videoUri, setVideoUri] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadLesson()
    loadCourses()
  }, [])

  const loadLesson = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken")
      const res = await fetch(`${API_BASE_URL}/admin/lessons/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await res.json()
      if (!res.ok) throw new Error("Failed to fetch lesson")
      setLesson(data)
    } catch (err) {
      console.error("Error loading lesson", err)
      Alert.alert("Error", "Could not load lesson details")
    } finally {
      setLoading(false)
    }
  }

  const loadCourses = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/Courses`)
      const data = await res.json()
      setCourses(data)
    } catch (err) {
      console.error("Error loading courses", err)
    }
  }

  const handlePickVideo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "video/*",
      })

      if (!result.canceled && result.assets && result.assets[0].uri) {
        setVideoUri(result.assets[0].uri)
        Alert.alert("🎬 Video Selected", result.assets[0].name)
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick a video file")
    }
  }

  const handleSave = async () => {
    if (!lesson?.title || !lesson.duration || !lesson.lessonOrder) {
      Alert.alert("Missing Info", "Please fill all fields")
      return
    }

    try {
      setSaving(true)
      const token = await AsyncStorage.getItem("userToken")
      if (!token) {
        Alert.alert("Session expired", "Please log in again")
        return
      }

      const formData = new FormData()
      formData.append("title", lesson.title)
      formData.append("duration", String(lesson.duration))
      formData.append("lessonOrder", String(lesson.lessonOrder))
      formData.append("courseId", String(lesson.courseId))

      if (videoUri) {
        formData.append("videoFile", {
          uri: videoUri,
          name: "lesson.mp4",
          type: "video/mp4",
        } as any)
      } else {
        formData.append("videoUrl", lesson.videoUrl || "")
      }

      const res = await fetch(`${API_BASE_URL}/admin/lessons/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to update lesson")

      Alert.alert("✅ Success", "Lesson updated successfully", [
        { text: "OK", onPress: () => router.replace("/admin/lessons") },
      ])
    } catch (err) {
      console.error("Update error:", err)
      Alert.alert("❌ Error", "Could not update lesson")
    } finally {
      setSaving(false)
    }
  }

  if (loading || !lesson)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007F7F" />
        <Text>Loading lesson...</Text>
      </View>
    )

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>✏️ Edit Lesson</Text>

      <TextInput
        style={styles.input}
        placeholder="Lesson Title"
        value={lesson.title}
        onChangeText={(text) => setLesson({ ...lesson, title: text })}
      />

      <TouchableOpacity style={styles.uploadBtn} onPress={handlePickVideo}>
        <Text style={styles.uploadText}>
          {videoUri ? "🎥 Change Video" : "📹 Upload New Video"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.currentVideo}>
        Current Video:{" "}
        {lesson.videoUrl
          ? lesson.videoUrl.split("/").pop()
          : "No video uploaded"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Duration (minutes)"
        keyboardType="numeric"
        value={lesson.duration.toString()}
        onChangeText={(text) =>
          setLesson({ ...lesson, duration: parseInt(text) || 0 })
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Lesson Order"
        keyboardType="numeric"
        value={lesson.lessonOrder.toString()}
        onChangeText={(text) =>
          setLesson({ ...lesson, lessonOrder: parseInt(text) || 0 })
        }
      />

      <Text style={styles.label}>Select Course</Text>
      <View style={styles.courseBox}>
        {courses.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={[
              styles.courseItem,
              lesson.courseId === c.id && { backgroundColor: "#007F7F" },
            ]}
            onPress={() => setLesson({ ...lesson, courseId: c.id })}
          >
            <Text
              style={[
                styles.courseText,
                lesson.courseId === c.id && { color: "#fff" },
              ]}
            >
              {c.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, saving && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  )
}
