import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import NavBar from "../../app/screens/NavBar";
import { API_BASE_URL } from "../../constants/config"; // ✅ centralised config

interface Course {
  id: number
  title: string
  price: number
  imageUrl: string
  categoryName?: string
}

interface UserProfile {
  id: number
  fullName: string
  email: string
}

interface Category {
  id: number
  name: string
}

export default function Home() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [trending, setTrending] = useState<Course[]>([])
  const [popular, setPopular] = useState<Course[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      setLoading(true)
      await Promise.all([loadUser(), loadCategories(), loadCourses()])
    } catch (err) {
      console.error(err)
      Alert.alert("Error", "Unable to load data from server")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const loadUser = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken")
      if (!token) {
        router.replace("/screens/auth/login")
        return
      }

      const res = await fetch(`${API_BASE_URL}/Users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        const text = await res.text()
        console.error("❌ Profile fetch failed:", text)
        throw new Error("User not found")
      }

      const data = await res.json()
      setUser(data)
    } catch (err) {
      console.error("Failed to load user", err)
    }
  }

  const loadCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`)
      if (!res.ok) throw new Error("Failed to fetch categories")
      const data = await res.json()
      setCategories(data)
    } catch (err) {
      console.error("Error loading categories:", err)
    }
  }

  const loadCourses = async () => {
    try {
      const [trRes, popRes] = await Promise.all([
        fetch(`${API_BASE_URL}/courses/trending`),
        fetch(`${API_BASE_URL}/courses/popular`),
      ])

      if (!trRes.ok || !popRes.ok)
        throw new Error("Failed to fetch courses")

      const [trData, popData] = await Promise.all([
        trRes.json(),
        popRes.json(),
      ])

      setTrending(trData)
      setPopular(popData)
    } catch (err) {
      console.error("Error loading courses:", err)
    }
  }

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken")
    router.replace("/screens/auth/login")
  }

  const renderCourse = ({ item }: { item: Course }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/course/${item.id}` as never)}
    >
      <Image
        source={{
          uri: item.imageUrl
            ? item.imageUrl
            : "https://via.placeholder.com/300x200?text=No+Image",
        }}
        style={styles.cardImage}
      />
      <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      <Text style={styles.courseTitle}>{item.title}</Text>
      <Text style={styles.instructor}>{item.categoryName}</Text>
    </TouchableOpacity>
  )

  if (loading)
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007F7F" />
        <Text style={{ marginTop: 10 }}>Loading content...</Text>
      </View>
    )

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={loadAllData} />
      }
    >
      {/* NAVBAR */}
      <NavBar userName={user?.fullName} onLogout={handleLogout} />

      {/* SEARCH */}
      <Text style={styles.title}>
        Let’s Learn <Text style={{ color: "#007F7F" }}>Something New 🎓</Text>
      </Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.search}
          placeholder="Search for courses"
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.filterButton}>
          <Text style={{ fontSize: 20 }}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* CATEGORIES */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ marginBottom: 25 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.category}
            onPress={() =>
              router.push(`/courses?category=${item.id}` as never)
            }
          >
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {/* TRENDING */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Trending Courses 🔥</Text>
        <TouchableOpacity onPress={() => router.push("/screens/courses")}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={trending.filter((c) =>
          c.title.toLowerCase().includes(search.toLowerCase())
        )}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderCourse}
      />

      {/* POPULAR */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular Courses ⭐</Text>
        <TouchableOpacity onPress={() => router.push("/screens/courses")}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={popular}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderCourse}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFCFC",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: { fontSize: 28, fontWeight: "700", marginVertical: 20, color: "#222" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  search: { flex: 1, height: 45, fontSize: 15 },
  filterButton: { backgroundColor: "#E6F2F2", borderRadius: 10, padding: 6 },
  category: {
    backgroundColor: "#E6F2F2",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  categoryText: { color: "#007F7F", fontWeight: "500" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 20, fontWeight: "600", color: "#1E1E1E" },
  seeAll: { color: "#007F7F", fontWeight: "600", fontSize: 14 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginRight: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: 200,
    overflow: "hidden",
  },
  cardImage: { width: "100%", height: 120 },
  price: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontWeight: "700",
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
    paddingHorizontal: 10,
  },
  instructor: {
    fontSize: 14,
    color: "#666",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
})
