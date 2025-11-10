import AsyncStorage from "@react-native-async-storage/async-storage";
import { Slot, router, usePathname } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [adminName, setAdminName] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("userToken");
      const info = await AsyncStorage.getItem("userInfo");

      if (!token || !info) {
        router.replace("/screens/auth/login");
        return;
      }

      try {
        const parsed = JSON.parse(info);
        if (parsed.role !== "Admin") {
          Alert.alert("Access Denied", "Only admins can access this area");
          router.replace("/screens/home");
          return;
        }
        setAdminName(parsed.fullName || "Admin");
      } catch {
        router.replace("/screens/auth/login");
      }
    })();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userInfo");
    router.replace("/screens/auth/login");
  };

  const NavItem = ({
    label,
    path,
    icon,
  }: {
    label: string;
    path: string;
    icon: string;
  }) => (
    <TouchableOpacity
      style={[
        styles.navItem,
        pathname === path && { backgroundColor: "#E6F4F4" },
      ]}
      onPress={() => router.push(path as any)}
    >
      <Text
        style={[
          styles.navText,
          pathname === path && { color: "#007F7F", fontWeight: "700" },
        ]}
      >
        {icon} {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Sidebar */}
      {isSidebarOpen && (
        <View style={styles.sidebar}>
          <Text style={styles.logo}>SALFORD ADMIN</Text>
          <Text style={styles.welcome}> Welcome, {adminName}</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>📊 Dashboard</Text>
            <NavItem label="Overview" path="/admin/Dashboard" icon="" />

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>👥 Users</Text>
            <NavItem label="All Users" path="/admin/users" icon="📋" />
            <NavItem label="Add User" path="/admin/add-user" icon="➕" />

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>📚 Courses</Text>
            <NavItem label="All Courses" path="/admin/courses" icon="📘" />
            <NavItem label="Add Course" path="/admin/add-course" icon="🆕" />

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>🎥 Lessons</Text>
            <NavItem label="Manage Lessons" path="/admin/lessons" icon="🎞️" />

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>🗂️ Categories</Text>
            <NavItem
              label="Manage Categories"
              path="/admin/categories"
              icon="🏷️"
            />

            <View style={styles.divider} />

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutText}> Logout</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* Main Content */}
      <View style={styles.content}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => setIsSidebarOpen((prev) => !prev)}
            style={styles.menuBtn}
          >
            <Text style={styles.menuText}>{isSidebarOpen ? "←" : "☰"}</Text>
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Admin Dashboard</Text>
        </View>

        {/* Page Content */}
        <View style={{ flex: 1 }}>
          <Slot />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row", backgroundColor: "#F8FAFB" },

  sidebar: {
    width: 260,
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRightWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 2, height: 0 },
    shadowRadius: 5,
    elevation: 2,
  },
  logo: {
    fontSize: 20,
    fontWeight: "800",
    color: "#007F7F",
    textAlign: "center",
    marginBottom: 8,
  },
  welcome: {
    textAlign: "center",
    color: "#555",
    marginBottom: 20,
    fontSize: 14,
  },
  sectionTitle: {
    fontWeight: "700",
    color: "#555",
    marginTop: 10,
    marginBottom: 6,
    fontSize: 15,
  },
  navItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  navText: { color: "#333", fontSize: 15 },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 10,
  },
  logoutBtn: {
    backgroundColor: "#007F7F",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 15,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
  },
  content: { flex: 1, padding: 20 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  menuBtn: {
    backgroundColor: "#E6F4F4",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  menuText: { fontSize: 18, color: "#007F7F" },
  pageTitle: { fontSize: 18, fontWeight: "700", marginLeft: 10 },
});
