import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native"
import { API_BASE_URL } from "../../constants/config"
import styles from "../styles/Dashboard.styles"
import { Stats } from "../types/models"

// ===================================================
// ✅ Component: Dashboard
// ===================================================
export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      setLoading(true)
      const token = await AsyncStorage.getItem("userToken")
      if (!token) {
        Alert.alert("Session expired", "Please log in again")
        return
      }

      // Fetch all entities in parallel
      const [usersRes, coursesRes, lessonsRes, categoriesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/Courses`),
        fetch(`${API_BASE_URL}/Lessons`),
        fetch(`${API_BASE_URL}/Categories`),
      ])

      const [users, courses, lessons, categories] = await Promise.all([
        usersRes.json(),
        coursesRes.json(),
        lessonsRes.json(),
        categoriesRes.json(),
      ])

      setStats({
        users: users.length,
        courses: courses.length,
        lessons: lessons.length,
        categories: categories.length,
      })
    } catch (error) {
      console.error("Dashboard load error:", error)
      Alert.alert("Error", "Unable to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007F7F" />
        <Text style={{ marginTop: 10 }}>Loading dashboard...</Text>
      </View>
    )

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>📊 Admin Dashboard</Text>
      <Text style={styles.subtitle}>Overview of your platform performance</Text>

      <View style={styles.grid}>
        <View style={[styles.card, { backgroundColor: "#E6F7F7" }]}>
          <Text style={styles.cardValue}>{stats?.users}</Text>
          <Text style={styles.cardLabel}>Users</Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#FFF6E6" }]}>
          <Text style={styles.cardValue}>{stats?.courses}</Text>
          <Text style={styles.cardLabel}>Courses</Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#EDEAFF" }]}>
          <Text style={styles.cardValue}>{stats?.lessons}</Text>
          <Text style={styles.cardLabel}>Lessons</Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#FBE8E8" }]}>
          <Text style={styles.cardValue}>{stats?.categories}</Text>
          <Text style={styles.cardLabel}>Categories</Text>
        </View>
      </View>

      <View style={styles.overviewBox}>
        <Text style={styles.overviewTitle}>System Summary</Text>
        <Text style={styles.overviewText}>
          ✅ {stats?.users} registered users actively using the system.
        </Text>
        <Text style={styles.overviewText}>
          📚 {stats?.courses} courses published across {stats?.categories} categories.
        </Text>
        <Text style={styles.overviewText}>
          🎓 {stats?.lessons} lessons available for students.
        </Text>
      </View>
    </ScrollView>
  )
}
