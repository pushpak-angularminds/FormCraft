import React from 'react'
import { Card, CardContent } from './ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Input } from './ui/input'
import { Switch } from '@/components/ui/switch'
import { GripVertical, Tally1, Trash2 } from 'lucide-react'
import { useDrag, useDrop } from 'react-dnd'

const questionTypes = [
    { value: 'text', label: 'Text' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'multipleChoice', label: 'Multiple Choice' },
    { value: 'radio', label: 'Radio Button' },
    { value: 'fileUpload', label: 'File Upload' },
    { value: 'dropdown', label: 'Dropdown' },
    { value: 'date', label: 'Date' },
]


const EditQuestionCard = ({ index, question, updateQuestion, deleteQuestion, moveQuestion, renderQuestionOptions }) => {
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
            className={`mb-4 py-4 ${isDragging ? 'opacity-50' : ''}`}>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="cursor-move">
                        <GripVertical size={24} />
                    </div>
                    <Select
                        value={question?.type}
                        onValueChange={(value) => updateQuestion(index, 'type', value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select question type" />
                        </SelectTrigger>
                        <SelectContent>
                            {questionTypes?.map((type) => (
                                <SelectItem key={type?.value} value={type?.value}>
                                    {type?.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Input
                    placeholder="Question"
                    value={question?.question}
                    onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                />
                {renderQuestionOptions(question, index)}

                <div className='flex flex-row-reverse items-center gap-4'>
                    <div className='flex items-center justify-center gap-3'>
                        <span>Required </span>
                        <Switch
                            checked={question?.required}
                            onCheckedChange={(e) => updateQuestion(index, 'required', e)}
                        />
                    </div>
                    <Tally1 size={30} />
                    <Trash2 color='red' onClick={() => deleteQuestion(index)} />
                </div>
            </CardContent>
        </Card>
    )
}

export default EditQuestionCard