// setQuestions((prevQuestions) => {
//     const updatedQuestions = [...prevQuestions]
//     const [reorderedItem] = updatedQuestions.splice(dragIndex, 1)
//     updatedQuestions.splice(hoverIndex, 0, reorderedItem)
//     return updatedQuestions
// })
import { useState, useEffect, useCallback } from 'react'
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
import EditQuestionCard from '@/components/EditQuestionCard'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'


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

export default function EditForm() {

    const { formId } = useParams()
    console.log('formId', formId)
    const { toast } = useToast()
    const [formTitle, setFormTitle] = useState('')
    const [formDescription, setFormDescription] = useState('')
    const [questions, setQuestions] = useState([])
    const [formLink, setFormLink] = useState('')

    useEffect(() => {
        const fetchFormData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/forms/${formId}`)
                console.log('response', response)
                const { title, description, questions } = response.data.form
                setFormTitle(title)
                setFormDescription(description)
                setQuestions(questions)
                setFormLink(`http://localhost:5173/forms/${formId}`)
            } catch (error) {
                console.log('Error fetching form data:', error)
                toast({
                    title: "Error",
                    description: "Failed to load form data.",
                    variant: "destructive",
                })
            }
        }
        fetchFormData()
    }, [formId, toast])

    const addQuestion = () => {
        setQuestions([...questions, { type: 'text', question: '', options: [], required: false }])
    }

    const updateQuestion = (index, field, value) => {
        const updatedQuestions = [...questions]
        updatedQuestions[index][field] = value
        setQuestions(updatedQuestions)
    }

    const deleteQuestion = (index) => {
        const updatedQuestions = [...questions]
        updatedQuestions.splice(index, 1)
        setQuestions(updatedQuestions)
    }

    const addOption = (questionIndex) => {
        const updatedQuestions = [...questions]
        const newOptionIndex = updatedQuestions[questionIndex].options.length
        updatedQuestions[questionIndex].options.push(`Option ${newOptionIndex + 1}`)
        setQuestions(updatedQuestions)
    }

    const removeOption = (questionIndex, optionIndex) => {
        const updatedQuestions = [...questions]
        updatedQuestions[questionIndex].options.splice(optionIndex, 1)
        setQuestions(updatedQuestions)
    }

    const updateOption = (questionIndex, optionIndex, value) => {
        const updatedQuestions = [...questions]
        updatedQuestions[questionIndex].options[optionIndex] = value
        setQuestions(updatedQuestions)
    }

    console.log( questions[0])
    const moveQuestion = useCallback((dragIndex, hoverIndex) => {
        console.log('dragIndex', dragIndex)
        console.log('hoverIndex', hoverIndex)
        // const allQuestions = [...questions];
        // console.log('allQuestions', allQuestions)
        // const getDraggedQuestion = allQuestions[dragIndex]
        // console.log('getDraggedQuestion', getDraggedQuestion)
        // allQuestions.splice(hoverIndex, 1, getDraggedQuestion)
        setQuestions((prev)=>{
            const getDragged = prev[dragIndex];
            let NewArr = [...prev]
            NewArr.splice(dragIndex, 1)
            NewArr.splice(hoverIndex, 0, getDragged)
            console.log(NewArr)
            return NewArr
        })

    }, [])

    const saveForm = async () => {
        if (!validateForm(formTitle, questions)) return
        try {
            const formData = { title: formTitle, description: formDescription, questions }
            console.log('Updating form data:', formData)
            const response = await axios.put(`http://localhost:3000/forms/${formId}`, formData)
            if (response.status === 200) {
                toast({
                    title: "Form Updated Successfully",
                    description: "Your form has been saved.",
                })
            }
        } catch (error) {
            console.error('Error updating form:', error)
            toast({
                title: "Error",
                description: "There was a problem saving your form.",
                variant: "destructive",
            })
        }
    }

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(formLink)
            toast({
                title: "Copied!",
                description: "URL has been copied to clipboard.",
            })
        } catch (err) {
            toast({
                title: "Failed to copy",
                description: "Something went wrong while copying the URL.",
                variant: "destructive",
            })
        }
    }

    const renderQuestionOptions = (question, index) => {
        switch (question?.type) {
            case 'text':
                return <Input disabled placeholder="Text answer" />
            case 'multipleChoice':
            case 'checkbox':
                return (
                    <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-2">
                                {question.type === 'multipleChoice' ? (
                                    <RadioGroup>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value={option} id={`q${index}-option-${optionIndex}`} disabled />
                                            <Label className='text-nowrap' htmlFor={`q${index}-option-${optionIndex}`}>{option || `Option ${optionIndex + 1}`}</Label>
                                        </div>
                                    </RadioGroup>
                                ) : (
                                    <Checkbox id={`q${index}-option-${optionIndex}`} disabled />
                                )}
                                <Input
                                    value={option}
                                    onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                                    placeholder={`Option ${optionIndex + 1}`}
                                />
                                <X onClick={() => removeOption(index, optionIndex)} />
                            </div>
                        ))}
                        <Button onClick={() => addOption(index)}>Add Option</Button>
                    </div>
                )
            case 'radio':
                return (
                    <div className="space-y-2">
                        <RadioGroup>
                            {question.options.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center space-x-2">
                                    <RadioGroupItem value={option} id={`q${index}-option-${optionIndex}`} disabled />
                                    <Input
                                        value={option}
                                        onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                                        placeholder={`Option ${optionIndex + 1}`}
                                    />
                                    <X onClick={() => removeOption(index, optionIndex)} />
                                </div>
                            ))}
                        </RadioGroup>
                        <Button onClick={() => addOption(index)}>Add Option</Button>
                    </div>
                )
            case 'fileUpload':
                return <Input type="file" disabled />
            case 'dropdown':
                return (
                    <div className="space-y-2">
                        <Select disabled>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent>
                                {question.options.map((option, optionIndex) => (
                                    <SelectItem key={optionIndex} value={option || `option-${optionIndex + 1}`}>
                                        {option || `Option ${optionIndex + 1}`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className='flex items-center gap-2'>
                                <Input
                                    value={option}
                                    onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                                    placeholder={`Option ${optionIndex + 1}`}
                                />
                                <X onClick={() => removeOption(index, optionIndex)} />
                            </div>
                        ))}
                        <Button onClick={() => addOption(index)}>Add Option</Button>
                    </div>
                )
            case 'date':
                return <Input type="date" disabled />
            default:
                return null
        }
    }

    return (
        <DndProvider backend={HTML5Backend}>

            <div className='w-screen min-h-screen pt-5 bg-blue-50'>
                <div className='flex md:w-3/5 mx-auto mb-3 space-x-2 mb-4'>
                    <Input value={formLink} readOnly placeholder="Generated URL will appear here" />
                    <Button onClick={copyToClipboard} disabled={!formLink}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                    </Button>
                </div>
                <div className="container md:w-3/5 mx-auto p-4 rounded-md">
                    <h1 className="text-2xl font-bold mb-4">Edit Form</h1>
                    <Card>
                        <CardHeader>
                            <CardTitle>Form Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Input
                                    placeholder="Form Title"
                                    value={formTitle}
                                    onChange={(e) => setFormTitle(e.target.value)}
                                />
                                <Textarea
                                    placeholder="Form Description"
                                    value={formDescription}
                                    onChange={(e) => setFormDescription(e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-2">Questions</h2>
                        {questions.map((question, index) => (
                            <EditQuestionCard
                                key={index}
                                index={index}
                                question={question}
                                setQuestions={setQuestions}
                                updateQuestion={updateQuestion}
                                moveQuestion={moveQuestion}
                                deleteQuestion={deleteQuestion}
                                renderQuestionOptions={renderQuestionOptions}
                            />
                        ))}
                        <Button onClick={addQuestion}>Add Question</Button>
                    </div>

                    <CardFooter className="mt-6">
                        <Button onClick={saveForm} className="w-full">Save Form</Button>
                    </CardFooter>
                </div>
            </div>

        </DndProvider>
    )
}

