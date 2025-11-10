import AsyncStorage from "@react-native-async-storage/async-storage"
import * as ImagePicker from "expo-image-picker"
import { router } from "expo-router"
import React, { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { API_BASE_URL } from "../../constants/config"
import styles from "../styles/AddCourse.styles"
import { Category } from "../types/models"

export default function AddCourse() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/Categories`)
      const data = await res.json()
      setCategories(data)
    } catch (err) {
      Alert.alert("Error", "Could not load categories")
    }
  }

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Allow gallery access to upload an image")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.canceled) {
      setImageUri(result.assets[0].uri)
    }
  }

  const handleAddCourse = async () => {
    if (!title || !description || !price || !categoryId) {
      Alert.alert("Missing Info", "Fill all required fields")
      return
    }

    try {
      setLoading(true)
      const token = await AsyncStorage.getItem("userToken")

      const formData = new FormData()
      formData.append("Title", title)
      formData.append("Description", description)
      formData.append("Price", price)
      formData.append("CategoryId", String(categoryId))

      if (imageUri) {
        const cleanUri = Platform.OS === "android" ? imageUri : imageUri.replace("file://", "")
        formData.append("imageFile", {
          uri: cleanUri,
          type: "image/jpeg",
          name: `course_${Date.now()}.jpg`,
        } as any)
      }

      const res = await fetch(`${API_BASE_URL}/admin/courses/create`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to create course")

      Alert.alert("✅ Success", "Course created successfully", [
        { text: "OK", onPress: () => router.replace("/admin/courses") },
      ])

      setTitle("")
      setDescription("")
      setPrice("")
      setCategoryId(null)
      setImageUri(null)
    } catch (err) {
      Alert.alert("❌ Error", "Could not create course")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add New Course</Text>

      <TextInput
        style={styles.input}
        placeholder="Course Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Course Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.uploadBtn} onPress={handlePickImage}>
        <Text style={styles.uploadText}>📸 Upload Course Image</Text>
      </TouchableOpacity>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.previewImage} />
      )}

      <Text style={styles.label}>Select Category</Text>
      <View style={styles.categoryBox}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryItem,
              categoryId === cat.id && { backgroundColor: "#007F7F" },
            ]}
            onPress={() => setCategoryId(cat.id)}
          >
            <Text
              style={[
                styles.categoryText,
                categoryId === cat.id && { color: "#fff" },
              ]}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleAddCourse}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Create Course</Text>}
      </TouchableOpacity>
    </ScrollView>
  )
}
