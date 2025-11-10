import { router } from "expo-router"
import React, { useRef, useState } from "react"
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native"

interface NavBarProps {
  userName?: string
  onLogout: () => void
}

export default function NavBar({ userName, onLogout }: NavBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const fadeAnim = useRef(new Animated.Value(0)).current

  const toggleDropdown = () => {
    const newState = !dropdownOpen
    setDropdownOpen(newState)
    Animated.timing(fadeAnim, {
      toValue: newState ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }

  return (
    <View style={styles.header}>
      <Text style={styles.greeting}>
        Hello{userName ? `, ${userName.split(" ")[0]}` : ""} 👋
      </Text>

      <View style={styles.headerIcons}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push("/screens/notifications")}
        >
          <Text style={styles.icon}>🔔</Text>
        </TouchableOpacity>

        {/* Avatar Dropdown */}
        <View style={{ position: "relative" }}>
          <TouchableOpacity onPress={toggleDropdown}>
            <Image
              source={{ uri: "https://i.pravatar.cc/100" }}
              style={styles.avatar}
            />
          </TouchableOpacity>

          {dropdownOpen && (
            <Animated.View
              style={[
                styles.dropdown,
                { opacity: fadeAnim, transform: [{ scale: fadeAnim }] },
              ]}
            >
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => router.push("/screens/profile")}
              >
                <Text style={styles.dropdownText}>👤 Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => router.push("/screens/settings")}
              >
                <Text style={styles.dropdownText}>⚙️ Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dropdownItem, styles.logoutItem]}
                onPress={onLogout}
              >
                <Text style={[styles.dropdownText, styles.logoutText]}>
                  🚪 Logout
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: { fontSize: 18, fontWeight: "600", color: "#1E1E1E" },
  headerIcons: { flexDirection: "row", alignItems: "center" },
  iconButton: {
    backgroundColor: "#F1F1F1",
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  icon: { fontSize: 18 },
  avatar: { width: 42, height: 42, borderRadius: 21, borderWidth: 2, borderColor: "#E0E0E0" },
  dropdown: {
    position: "absolute",
    top: 50,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
    width: 180,
    zIndex: 20,
  },
  dropdownItem: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8 },
  dropdownText: { fontSize: 15, color: "#1E1E1E" },
  logoutItem: { borderTopWidth: 1, borderTopColor: "#f1f1f1", marginTop: 4 },
  logoutText: { color: "#E53935", fontWeight: "600" },
})
