export interface Course {
  id: number
  title: string
  description?: string
  price: number
  imageUrl: string
  categoryName?: string
}
export interface UserProfile {
  id: number
  fullName: string
  email: string
  role?: "Student" | "Admin"
  token?: string
subscriptionStatus: string
}
export interface Stats {
  users: number
  courses: number
  lessons: number
  categories: number
}

export interface Category {
  id: number
  name: string
}

export interface Course {
  id: number
  title: string
  price: number
  imageUrl: string
  categoryName?: string
}

export interface User {
  id: number
  fullName: string
  email: string
  role: string
  subscriptionStatus?: string
}


export interface Lesson {
  id: number
  title: string
  videoUrl: string
  duration: number
  courseTitle: string
  courseId: number
    lessonOrder: number
  createdAt?: string

}



