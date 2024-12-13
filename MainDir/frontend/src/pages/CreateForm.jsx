import { useState, useCallback } from 'react'
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
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
import { Copy, GripVertical, Tally1, Trash2, X } from 'lucide-react'
import { validateForm } from '@/utils/ValidateCreateForm'

const questionTypes = [
  { value: 'text', label: 'Text' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'multipleChoice', label: 'Multiple Choice' },
  { value: 'radio', label: 'Radio Button' },
  { value: 'fileUpload', label: 'File Upload' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'date', label: 'Date' },
]

const QuestionCard = ({ question, index, moveQuestion, updateQuestion, deleteQuestion, renderQuestionOptions }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'QUESTION',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: 'QUESTION',
    hover(item, monitor) {
      if (!drag) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      if (dragIndex === hoverIndex) {
        return
      }
      moveQuestion(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  return (
    <Card
      ref={(node) => drag(drop(node))}
      className={`mb-4 py-4 ${isDragging ? 'opacity-50' : ''}`}
    >
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="cursor-move">
            <GripVertical size={24} />
          </div>
          <Select
            value={question.type}
            onValueChange={(value) => updateQuestion(index, 'type', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select question type" />
            </SelectTrigger>
            <SelectContent>
              {questionTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Input
          placeholder="Question"
          value={question.question}
          onChange={(e) => updateQuestion(index, 'question', e.target.value)}
        />
        {renderQuestionOptions(question, index)}

        <div className='flex flex-row-reverse items-center gap-4'>
          <div className='flex items-center justify-center gap-3'>
            <span>Required</span>
            <Switch
              checked={question.required}
              onCheckedChange={(checked) => updateQuestion(index, 'required', checked)}
            />
          </div>
          <Tally1 size={24} />
          <Button variant="ghost" size="icon" onClick={() => deleteQuestion(index)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function FormCreator() {
  const { toast } = useToast()
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [questions, setQuestions] = useState([])
  const [formLink, setFormLink] = useState('')

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

  const moveQuestion = useCallback((dragIndex, hoverIndex) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions]
      const [reorderedItem] = updatedQuestions.splice(dragIndex, 1)
      console.log('reorderedItem', reorderedItem)
      updatedQuestions.splice(hoverIndex, 0, reorderedItem)
      return updatedQuestions
    })
  }, [])

  const saveForm = async () => {
    if (!validateForm(formTitle, questions)) return
    try {
      const formData = { title: formTitle, description: formDescription, questions }
      formData.adminId = localStorage.getItem('userId')
      const response = await axios.post("http://localhost:3000/create-form", formData)
      setFormLink(`http://localhost:5173/forms/${response?.data?.form?._id}`)
      if (response.status === 201) {
        toast({
          title: "Form Created Successfully",
          description: "Your form has been saved.",
        })
        setFormTitle('')
        setFormDescription('')
        setQuestions([])
      }
    } catch (error) {
      console.error('Error saving form:', error)
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
    switch (question.type) {
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
                <Button variant="ghost" size="icon" onClick={() => removeOption(index, optionIndex)}>
                  <X className="h-4 w-4" />
                </Button>
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
                  <Button variant="ghost" size="icon" onClick={() => removeOption(index, optionIndex)}>
                    <X className="h-4 w-4" />
                  </Button>
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
                <Button variant="ghost" size="icon" onClick={() => removeOption(index, optionIndex)}>
                  <X className="h-4 w-4" />
                </Button>
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
      <div className='w-full min-h-screen pt-5 bg-gray-50 dark:bg-gray-900'>
        <div className='flex max-w-3xl mx-auto mb-4 space-x-2'>
          <Input value={formLink} readOnly placeholder="Generated URL will appear here" />
          <Button onClick={copyToClipboard} disabled={!formLink}>
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </Button>
        </div>
        <div className="container max-w-3xl mx-auto p-4 rounded-md">
          <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Create a New Form</h1>
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
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Questions</h2>
            {questions.map((question, index) => (
              <QuestionCard
                key={index}
                question={question}
                index={index}
                moveQuestion={moveQuestion}
                updateQuestion={updateQuestion}
                deleteQuestion={deleteQuestion}
                renderQuestionOptions={renderQuestionOptions}
              />
            ))}
            <Button onClick={addQuestion} className="mt-4">Add Question</Button>
          </div>

          <CardFooter className="mt-6">
            <Button onClick={saveForm} className="w-full">Save Form</Button>
          </CardFooter>
        </div>
      </div>
    </DndProvider>
  )
}

