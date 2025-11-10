import { useState } from "react"

export function useToast(duration = 2500) {
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState("")
  const [emoji, setEmoji] = useState("🎉")

  const showToast = (msg: string, icon?: string) => {
    setMessage(msg)
    if (icon) setEmoji(icon)
    setVisible(true)
  }

  const hideToast = () => setVisible(false)

  return { visible, message, emoji, showToast, hideToast, duration }
}
