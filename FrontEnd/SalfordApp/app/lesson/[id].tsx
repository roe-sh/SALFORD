import AsyncStorage from "@react-native-async-storage/async-storage"
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av"
import { router, useLocalSearchParams } from "expo-router"
import React, { useEffect, useRef, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { API_BASE_URL } from "../../constants/config"
import styles from "../styles/LessonPlayer.styles"
import { Lesson } from "../types/models"

export default function LessonPlayer() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [completed, setCompleted] = useState(false)
  const videoRef = useRef<Video>(null)

  useEffect(() => {
    loadLesson()
  }, [])

  const loadLesson = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/Lessons/${id}`)
      const data = await res.json()
      setLesson(data)
    } catch {
      Alert.alert("Error", "Could not load lesson")
    } finally {
      setLoading(false)
    }
  }

  const handlePlaybackStatusUpdate = async (status: AVPlaybackStatus) => {
    if (!("didJustFinish" in status)) return

    if (status.didJustFinish && !completed) {
      setCompleted(true)
      try {
        const token = await AsyncStorage.getItem("userToken")
        if (token) {
          await fetch(`${API_BASE_URL}/Lessons/${id}/progress`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ progress: 100 }),
          })
        }
        Alert.alert("✅ Lesson Complete", "You finished this lesson.")
      } catch {}
    }
  }

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007F7F" />
        <Text>Loading video...</Text>
      </View>
    )

  if (!lesson)
    return (
      <View style={styles.center}>
        <Text>Lesson not found</Text>
      </View>
    )

  // ✅ Fix video URL for Android Emulator
  const videoUri = lesson.videoUrl
    ? lesson.videoUrl.replace("localhost", "10.0.2.2")
    : null

  return (
    <View style={styles.container}>
      <Text style={styles.courseTitle}>{lesson.courseTitle}</Text>
      <Text style={styles.title}>{lesson.title}</Text>

      {videoUri ? (
        <Video
          ref={videoRef}
          source={{ uri: videoUri }}
          style={styles.video}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        />
      ) : (
        <Text>No video URL</Text>
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push(`/course/${lesson.courseId}` as never)}
      >
        <Text style={styles.backText}>⬅ Back to Course</Text>
      </TouchableOpacity>
    </View>
  )
}
