import { toast } from "@/hooks/use-toast"

export const validateForm = (formTitle, questions) => {
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
            // console.log('question.type', question.type)
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
