
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import axios from 'axios'
import { Switch } from '@/components/ui/switch'
import { Copy, Tally1, Trash2, X } from 'lucide-react'
import { useParams } from 'react-router-dom'

const questionTypes = [
    { value: 'text', label: 'Text' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'multipleChoice', label: 'Multiple Choice' },
    { value: 'radio', label: 'Radio Button' },
    { value: 'fileUpload', label: 'File Upload' },
    { value: 'dropdown', label: 'Dropdown' },
    { value: 'date', label: 'Date' },
]

const validateForm = (formTitle, questions) => {
    if (!formTitle.trim()) {
        toast({
            title: "Validation Error",
            description: "Form title cannot be empty.",
            variant: "destructive",
        })
        return false
    }

    for (let i = 0; i < questions.length; i++) {
        const question = questions[i]

        if (!question.question.trim()) {
            toast({
                title: "Validation Error",
                description: `Question ${i + 1} cannot be empty.`,
                variant: "destructive",
            })
            return false
        }

        if (
            ['multipleChoice', 'checkbox', 'dropdown', 'radio'].includes(question.type) &&
            (question.options.length === 0 || question.options.some(option => !option.trim()))
        ) {
            toast({
                title: "Validation Error",
                description: `Question ${i + 1} has empty or no options.`,
                variant: "destructive",
            })
            return false
        }
    }

    return true
}



// just made a change 
