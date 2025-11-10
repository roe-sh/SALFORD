import React, { useEffect, useRef } from "react"
import { Animated, Easing, Text, TextStyle, ViewStyle } from "react-native"

interface ToastProps {
  visible: boolean
  message: string
  emoji?: string
  duration?: number
  onHide?: () => void
  style?: ViewStyle
  textStyle?: TextStyle
}

export default function Toast({
  visible,
  message,
  emoji = "🎉",
  duration = 2500,
  onHide,
  style,
  textStyle,
}: ToastProps) {
  const slideAnim = useRef(new Animated.Value(100)).current
  const opacityAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 100,
            duration: 400,
            useNativeDriver: true,
            easing: Easing.in(Easing.ease),
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => onHide && onHide())
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [visible])

  if (!visible) return null

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          bottom: 40,
          left: 20,
          right: 20,
          backgroundColor: "#007F7F",
          borderRadius: 14,
          paddingVertical: 14,
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 2 },
          elevation: 4,
          opacity: opacityAnim,
          transform: [{ translateY: slideAnim }],
        },
        style,
      ]}
    >
      <Text style={[{ fontSize: 22, marginRight: 8 }, textStyle]}>{emoji}</Text>
      <Text
        style={[
          { color: "#fff", fontWeight: "600", fontSize: 15, textAlign: "center" },
          textStyle,
        ]}
      >
        {message}
      </Text>
    </Animated.View>
  )
}
