'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

export default function SignInForm() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const validateForm = () => {
    let errors = {}
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid'
    }
    if (!formData.password.trim()) {
      errors.password = 'Password is required'
    }
    setErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      console.log('Submitting form data:', formData)
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/sign-in`, formData)
      console.log('response', response)
      
      if (response.status === 200) {
        localStorage.setItem('userId', response?.data?.user?._id)
        toast({
          title: "Sign-In Successful",
          description: "You are now logged in.",
        })

        // Redirect to the user dashboard
        navigate(`/user-forms/${response?.data?.user?._id}`)
      }
      
      // Clear the form after successful submission (if needed)
      setFormData({ email: '', password: '' })
    } catch (error) {
      console.error('Error during sign-in:', error)
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Invalid email or password.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    if (userId) {
      // If the user is already logged in, redirect them to the dashboard
      navigate(`/user-forms/${userId}`)
    }
  }, [navigate])

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
            <div className="text-sm text-center">
              Don't have an account? <Link to="/sign-up" className="text-blue-600 hover:underline">Sign Up</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
