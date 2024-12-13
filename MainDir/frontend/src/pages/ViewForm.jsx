import { useEffect, useState } from 'react'
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
import { useParams } from 'react-router-dom'
import { validateForm } from '@/utils/ValidateViewForm'

export default function ViewForm() {
  const { toast } = useToast() // Toast hook
  const [questions, setQuestions] = useState([]) // for upadation answers
  const [formData, setFormData] = useState('') // to show form only 
  const [formTitle, setFormTitle] = useState('') // 
  const param = useParams();

  useEffect(() => {
    async function getFormData() {
      try {
        const response = await axios.get(`http://localhost:3000/forms/${param?.formId}`);
        setFormData(response?.data?.form);
        setFormTitle(response?.data?.form?.title)

        const initializedQuestions = response?.data?.form.questions.map((question) => {
          let initialAnswer;
          switch (question.type) {
            case 'multiple':
            case 'checkbox':
              initialAnswer = []; // Multiple selections
              break;
            case 'radio':
            case 'dropdown':
              initialAnswer = null; // Single selection
              break;
            case 'fileUpload':
              initialAnswer = null; // Placeholder for file object
              break;
            default:
              initialAnswer = ''; // Text-based input
          }
          return { ...question, answer: initialAnswer };
        });

        setQuestions(initializedQuestions);
        console.log('response', response);
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    }
    getFormData();
  }, [param]);

  const handleAnswer = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index]['answer'] = value;
    setQuestions(updatedQuestions);
  };

  const handleCheckboxChange = (index, option) => {
    const updatedQuestions = [...questions];
    const currentAnswers = updatedQuestions[index]['answer'];

    if (currentAnswers.includes(option)) {
      // Remove option if already selected
      updatedQuestions[index]['answer'] = currentAnswers.filter((item) => item !== option);
    } else {
      // Add option if not selected
      updatedQuestions[index]['answer'] = [...currentAnswers, option];
    }
    setQuestions(updatedQuestions);
  };


  const saveForm = async () => {
    if (!validateForm(questions)) return; // Stop submission if validation fails
    try {
      const ansArr = questions.map((item) => {
        return { question: item.question, answer: item.answer}
      })
      const payload = { formId: formData._id, answers: ansArr, version: formData?.version};
      console.log('Submitting form data:', ansArr);

      const response = await axios.post("http://localhost:3000/form-response", payload, {
        // formData, headers: {
        //     'Content-type': "multipart/form-data"
        // }
      });
      console.log('response', response?.data?.form?._id);
      if (response.status === 201) {
        toast({
          title: "Form Submited Successfully",
          description: "Your form has been saved.",
        });

        // Reset form after successful save
        setFormTitle('Your responce has been saved ');
        setQuestions([]);
      }
    } catch (error) {
      console.error('Error saving form:', error);
      toast({
        title: "Error",
        description: "There was a problem saving your form.",
        variant: "destructive",
      });
    }
  };

  console.log('questions ->', questions)

  const renderQuestionOptions = (question, index) => {
    switch (question.type) {
      case 'text':
        return (
          <Input
            placeholder="Text answer"
            value={question.answer}
            onChange={(e) => handleAnswer(index, e.target.value)}
          />
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center space-x-2">
                <Checkbox
                  id={`q${index}-option-${optionIndex}`}
                  checked={question.answer.includes(option)}
                  onCheckedChange={() => handleCheckboxChange(index, option)}
                />
                <Label htmlFor={`q${index}-option-${optionIndex}`}>{option}</Label>
              </div>
            ))}
          </div>
        );

      case 'multipleChoice':
        return (
          <div className="space-y-2">
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center space-x-2">
                <Checkbox
                  id={`q${index}-option-${optionIndex}`}
                  checked={question.answer.includes(option)}
                  onCheckedChange={() => handleCheckboxChange(index, option)}
                />
                <Label htmlFor={`q${index}-option-${optionIndex}`}>{option}</Label>
              </div>
            ))}
          </div>
        );

      case 'radio':
        return (
          <RadioGroup
            value={question.answer}
            onValueChange={(value) => handleAnswer(index, value)}
          >
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`q${index}-option-${optionIndex}`} />
                <Label htmlFor={`q${index}-option-${optionIndex}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'fileUpload':
        return (
          <Input
            type="file"
            onChange={(e) => handleAnswer(index, e.target.files[0]?.name)}
          />
        );

      case 'dropdown':
        return (
          <div className="space-y-2">
            <Select
              value={question.answer}
              onValueChange={(value) => handleAnswer(index, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {question.options.map((option, optionIndex) => (
                  <SelectItem key={optionIndex} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

          </div>
        );

      case 'date':
        return <Input type="date" onChange={(e) => handleAnswer(index, e.target.value)} />
      default:
        return null;
    }
  };


  return (
    <div className='w-screen min-h-screen pt-5 bg-blue-50'>
      <div className="container md:w-3/5 mx-auto p-4 rounded-md">

        <h1 className="text-4xl font-bold mb-4 text-center"  >{formTitle}</h1>
        <p className='text-muted underline text-center'>{questions.length > 0 && formData?.description}</p>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2 ">{questions.length > 0 && 'Questions'} </h2>
          {questions.map((question, index) => (
            <Card key={index} className="mb-4 py-4">
              <CardContent className="space-y-4">
                {/* select question type */}
                <p>{question?.question} <span className='text-red-600'> {question.required ? '*' : ""}</span> </p>
                {renderQuestionOptions(question, index)}
              </CardContent>
            </Card>
          ))}
        </div>
        {
          questions.length > 0 &&
          <CardFooter className="mt-6">
            <Button onClick={saveForm} type='button' className="w-full">Save Form</Button>
          </CardFooter>}
      </div>
    </div>
  )
}