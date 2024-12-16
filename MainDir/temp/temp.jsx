const saveForm = async () => {
  if (!validateForm(questions)) return; // Stop submission if validation fails

  try {
    const formDataToSend = new FormData();

    // Append formId and version
    formDataToSend.append("formId", formData._id);
    formDataToSend.append("version", formData?.version);
    const ansArr = questions.map((item) => {
      return { question: item.question, answer: item.answer }
    })
    formDataToSend.append("answers", ansArr);

    // Loop through questions and handle answers
    // questions.forEach((item, index) => {
    //   if (Array.isArray(item.answer)) {
    //     // Handle answers that are arrays (can be files or strings)
    //     item.answer.forEach((answerItem, answerIndex) => {
    //       if (answerItem instanceof File) {
    //         // If the answer is a file, append it to the FormData
    //         formDataToSend.append(`answers[${index}][answer][${answerIndex}]`, answerItem);
    //       } else {
    //         // If the answer is a string, append it as text
    //         formDataToSend.append(`answers[${index}][answer][${answerIndex}]`, answerItem);
    //       }
    //     });
    //   } else if (item.answer instanceof File) {
    //     // If the answer is a single file
    //     formDataToSend.append(`answers[${index}][answer]`, item.answer);
    //   } else {
    //     // For single text answers
    //     formDataToSend.append(`answers[${index}][answer]`, item.answer);
    //   }

    //   // Append the question text
    //   formDataToSend.append(`answers[${index}][question]`, item.question);
    // });

    console.log('Submitting form data:', formDataToSend);

    // Send the request with FormData (no need to set Content-Type manually)
    const response = await axios.post("http://localhost:3000/form-response", formDataToSend);

    console.log('response', response?.data?.form?._id);

    if (response.status === 201) {
      toast({
        title: "Form Submitted Successfully",
        description: "Your form has been saved.",
      });

      // Reset form after successful save
      setFormTitle('Your response has been saved');
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
