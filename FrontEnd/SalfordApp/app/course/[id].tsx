import AsyncStorage from "@react-native-async-storage/async-storage"
import { router, useLocalSearchParams } from "expo-router"
import React, { useEffect, useState } from "react"
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native"
import { API_BASE_URL } from "../../constants/config"
import styles from "../styles/CourseDetails.styles"
import { Course, Lesson } from "../types/models"

// ===================================================
// ✅ Component: CourseDetails
// ===================================================
export default function CourseDetails() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [isEnrolled, setIsEnrolled] = useState(false)

  useEffect(() => {
    loadCourseDetails()
  }, [])

  // ===================================================
  // 🧩 Load course + lessons + enrollment state
  // ===================================================
  const loadCourseDetails = async () => {
    try {
      setLoading(true)

      const [courseRes, lessonRes] = await Promise.all([
        fetch(`${API_BASE_URL}/Courses/${id}`),
        fetch(`${API_BASE_URL}/Lessons?courseId=${id}`),
      ])

      if (!courseRes.ok || !lessonRes.ok)
        throw new Error("Failed to fetch course data")

      const courseData = await courseRes.json()
      const lessonData = await lessonRes.json()

      setCourse(courseData)
      setLessons(lessonData)

      // check if user is enrolled
      const token = await AsyncStorage.getItem("userToken")
      if (token) {
        const myCoursesRes = await fetch(`${API_BASE_URL}/HomePage/my-courses`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (myCoursesRes.ok) {
          const myCourses = await myCoursesRes.json()
          const enrolled = myCourses.some(
            (c: Course) => c.id === Number(id)
          )
          setIsEnrolled(enrolled)
        }
      }
    } catch (err) {
      console.error("Failed to load course details:", err)
      Alert.alert("Error", "Could not load course details.")
    } finally {
      setLoading(false)
    }
  }

  // ===================================================
  // 🧠 Handle enrollment
  // ===================================================
  const handleEnroll = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken")
      if (!token) {
        Alert.alert("Login Required", "Please login to enroll in this course")
        router.push("/screens/auth/login")
        return
      }

      const res = await fetch(`${API_BASE_URL}/Subscriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId: Number(id) }),
      })

      if (!res.ok) throw new Error("Failed to enroll")

      Alert.alert("✅ Success", "You have been enrolled in this course!")
      setIsEnrolled(true)
    } catch (err) {
      console.error("Enrollment failed:", err)
      Alert.alert("❌ Error", "Could not enroll in this course")
    }
  }

  // ===================================================
  // 🧾 Render states
  // ===================================================
  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007F7F" />
        <Text style={{ marginTop: 10 }}>Loading course details...</Text>
      </View>
    )

  if (!course)
    return (
      <View style={styles.center}>
        <Text>Course not found</Text>
      </View>
    )

  // ensure absolute image path
  const bannerUri =
    course.imageUrl && !course.imageUrl.startsWith("http")
      ? `${API_BASE_URL}/${course.imageUrl}`
      : course.imageUrl ||
        "https://via.placeholder.com/600x300?text=No+Image"

  // ===================================================
  // 🖼️ Page Layout
  // ===================================================
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Course Banner */}
      <Image source={{ uri: bannerUri }} style={styles.banner} />

      {/* Course Info */}
      <View style={styles.infoSection}>
        <Text style={styles.title}>{course.title}</Text>
        <Text style={styles.category}>{course.categoryName}</Text>
        <Text style={styles.price}>${course.price}</Text>
        <Text style={styles.description}>{course.description}</Text>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isEnrolled ? "#6A5ACD" : "#007F7F" },
          ]}
          onPress={
            isEnrolled
              ? () => router.push(`/lessons?courseId=${id}` as never)
              : handleEnroll
          }
        >
          <Text style={styles.buttonText}>
            {isEnrolled ? "Continue Learning ▶️" : "Start Course 🚀"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lessons Section */}
      <View style={styles.lessonsSection}>
        <Text style={styles.sectionHeader}>
          Lessons ({lessons.length})
        </Text>

        {lessons.length === 0 ? (
          <Text>No lessons available yet.</Text>
        ) : (
          <FlatList
            data={[...lessons].sort((a, b) => a.lessonOrder - b.lessonOrder)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.lessonCard}
                onPress={() => {
                  if (!isEnrolled) {
                    Alert.alert("Access Denied", "Enroll first to watch lessons")
                    return
                  }
                  router.push(`/lesson/${item.id}` as never)
                }}
              >
                <Text style={styles.lessonOrder}>Lesson {item.lessonOrder}</Text>
                <Text style={styles.lessonTitle}>{item.title}</Text>
                <Text style={styles.lessonDuration}>⏱ {item.duration} min</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </ScrollView>
  )
}
