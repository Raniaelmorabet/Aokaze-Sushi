// contexts/AuthContext.js
"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authAPI, isAuthenticated } from "../utils/api"

// Create context
const AuthContext = createContext({
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
  updateUserPassword: async () => {},
})

// Export the provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  // Load user on initial render
  useEffect(() => {
    const loadUser = async () => {
      if (!isAuthenticated()) {
        setLoading(false)
        return
      }

      try {
        const response = await authAPI.getCurrentUser()
        setUser(response.data)
      } catch (err) {
        console.error("Error loading user:", err)
        // Clear token if invalid
        localStorage.removeItem("token")
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  // Login user
  const login = async (email, password) => {
    setLoading(true)
    setError(null)

    try {
      const response = await authAPI.login(email, password)
      setUser(response.data)
      return response
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Register user
  const register = async (userData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await authAPI.register(userData)
      setUser(response.data)
      return response
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Logout user
  const logout = async () => {
    setLoading(true)

    try {
      await authAPI.logout()
      setUser(null)
      router.push("/auth/login")
    } catch (err) {
      console.error("Logout error:", err)
    } finally {
      setLoading(false)
    }
  }

  // Update user profile
  const updateProfile = async (userData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await authAPI.updateUserDetails(userData)
      setUser(response.data)
      return response
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }