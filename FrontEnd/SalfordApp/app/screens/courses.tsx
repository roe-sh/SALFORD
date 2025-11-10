import { router } from "expo-router"
import React, { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { API_BASE_URL } from "../../constants/config"
import styles from "../styles/Courses.styles"
import { Course } from "../types/models"

// ===================================================
// ✅ Hook: useCourses — reusable data fetching pattern
// ===================================================
function useCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadCourses = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("🔹 Fetching courses from:", `${API_BASE_URL}/Courses`)
      const res = await fetch(`${API_BASE_URL}/Courses`)

      if (!res.ok) {
        const text = await res.text()
        console.error("❌ Server response:", text)
        throw new Error("Failed to fetch courses")
      }

      const data = await res.json()
      setCourses(data)
    } catch (err: any) {
      console.error("Failed to load courses:", err)
      setError(err.message)
      Alert.alert(
        "Error",
        "Could not fetch courses.\nPlease ensure your backend is running."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCourses()
  }, [])

  return { courses, loading, error, refetch: loadCourses }
}

// ===================================================
// ✅ Component: Courses
// ===================================================
export default function Courses() {
  const { courses, loading, error } = useCourses()
  const [search, setSearch] = useState("")

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  )

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007F7F" />
        <Text style={{ marginTop: 10 }}>Loading courses...</Text>
      </View>
    )

  if (error)
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>Error: {error}</Text>
      </View>
    )

  return (
    <View style={styles.container}>
      <Text style={styles.header}>All Courses 📚</Text>

      <TextInput
        style={styles.search}
        placeholder="Search courses..."
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          // ensure absolute image URL
          const imageUri =
            item.imageUrl && !item.imageUrl.startsWith("http")
              ? `${API_BASE_URL}/${item.imageUrl}`
              : item.imageUrl || "https://via.placeholder.com/300x200?text=No+Image"

          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/course/${item.id}` as never)}
            >
              <Image source={{ uri: imageUri }} style={styles.cardImage} />
              <View style={styles.cardBody}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.category}>
                  {item.categoryName || "Uncategorised"}
                </Text>
                <Text style={styles.price}>${item.price}</Text>
              </View>
            </TouchableOpacity>
          )
        }}
      />
    </View>
  )
}
