import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  icon?: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const mock = [
      {
        id: 1,
        title: "New Course Added 🎓",
        message: "A new UI & UX Design course is now available.",
        time: "2h ago",
        icon: "https://cdn-icons-png.flaticon.com/512/2721/2721298.png",
      },
      {
        id: 2,
        title: "Schedule Reminder ⏰",
        message: "Don’t forget your Animation class starts tomorrow.",
        time: "5h ago",
        icon: "https://cdn-icons-png.flaticon.com/512/786/786407.png",
      },
      {
        id: 3,
        title: "Achievement Unlocked 🏆",
        message: "You completed the Graphic Design Basics course!",
        time: "1d ago",
        icon: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
      },
    ];
    setNotifications(mock);
  }, []);

  const renderItem = ({ item }: { item: Notification }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.icon }} style={styles.icon} />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications 🔔</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFA",
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#007F7F",
    marginTop: 40,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 14,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    width: 48,
    height: 48,
    marginRight: 12,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
    color: "#222",
  },
  message: {
    fontSize: 14,
    color: "#555",
    marginVertical: 2,
  },
  time: {
    fontSize: 12,
    color: "#888",
  },
});
