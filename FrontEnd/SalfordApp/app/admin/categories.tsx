import React, { useEffect, useState } from "react"
import {
    Alert,
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native"
import { API_BASE_URL } from "../../constants/config"
import styles from "../styles/Categories.styles"
import { Category } from "../types/models"

// ===================================================
// ✅ Component: CategoriesPage
// ===================================================
export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE_URL}/Categories`)
      if (!res.ok) throw new Error("Failed to load categories")
      const data = await res.json()
      setCategories(data)
    } catch (err) {
      console.error("Error loading categories:", err)
      Alert.alert("Error", "Failed to load categories")
    } finally {
      setLoading(false)
    }
  }

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      Alert.alert("Error", "Please enter a category name")
      return
    }

    try {
      setLoading(true)
      const res = await fetch(`${API_BASE_URL}/Categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      })

      if (!res.ok) throw new Error("Failed to add category")

      Alert.alert("✅ Success", "Category added successfully")
      setNewCategory("")
      loadCategories()
    } catch (err) {
      console.error("Add category error:", err)
      Alert.alert("❌ Error", "Failed to add category")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🗂️ Manage Categories</Text>

      <TextInput
        placeholder="Enter new category"
        value={newCategory}
        onChangeText={setNewCategory}
        style={styles.input}
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleAddCategory}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Adding..." : "Add Category"}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.categoryText}>{item.name}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ color: "#777", textAlign: "center", marginTop: 20 }}>
            No categories available
          </Text>
        }
      />
    </View>
  )
}
