import { toast } from "@/hooks/use-toast";

export const validateForm = (questions) => {
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      
      // Check if the question is required
      if (question.required) {
        // Handle text-based inputs (like text, date, etc.)
        if (['text', 'date'].includes(question.type) && !question.answer) {
          toast({
            title: "Validation Error",
            description: `Please fill out the required field: "${question.question}"`,
            variant: "destructive",
          });
          return false;
        }
  
        // Handle checkbox or multiple-choice questions (must have at least one selected)
        if ((question.type === 'checkbox' || question.type === 'multipleChoice') && question.answer.length === 0) {
          toast({
            title: "Validation Error",
            description: `Please select at least one option for: "${question.question}"`,
            variant: "destructive",
          });
          return false;
        }
  
        // Handle radio or dropdown questions (must have a selected answer)
        if ((question.type === 'radio' || question.type === 'dropdown') && !question.answer) {
          toast({
            title: "Validation Error",
            description: `Please select an option for: "${question.question}"`,
            variant: "destructive",
          });
          return false;
        }
  
        // Handle file upload questions (must have a file uploaded)
        if (question.type === 'fileUpload' && !question.answer) {
          toast({
            title: "Validation Error",
            description: `Please upload a file for: "${question.question}"`,
            variant: "destructive",
          });
          return false;
        }
      }
    }
    return true; // If all validations pass
  };
  