import { Platform } from "react-native"

let API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:5252/api"

// if running on a physical device, replace localhost automatically
if (Platform.OS !== "web" && API_BASE_URL.includes("localhost")) {
  API_BASE_URL = "https://192.168.1.100:7004/api" // 👈 your LAN IP
}

export { API_BASE_URL }

