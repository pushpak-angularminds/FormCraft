'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

export default function SignupForm() {
  const { toast } = useToast()
  const navigate =useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // This is where you would typically make an API call
      // For demonstration, we're just logging the data and showing a success message
      console.log('Submitting form data:', formData)
      const response = await axios.post("http://localhost:3000/auth/sign-up", formData);
      console.log('response', response);
      // Simulating an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Account created.",
        description: "We've created your account for you.",
      })
      
      // Clear the form after successful submission
      setFormData({ name: '', email: '', password: '' })
    } catch (error) {
      console.error('Error submitting form:', error)
      toast({
        title: "Error",
        description: "There was a problem creating your account.",
        variant: "destructive",
      })
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
          <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">Sign Up</Button>
            <div className="text-sm text-center">
              Already have an account? <Link to="/sign-in" className="text-blue-600 hover:underline">Sign In</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

