const express = require('express');
const router = express.Router();
const Form = require('../models/Form'); // Assuming the Form schema is in the `models` folder
const { default: mongoose } = require('mongoose');
const Response = require('../models/Response');
const multer = require('multer');



// Route to submit a form response
router.post('/form-response', async (req, res) => {
  try {
    const { formId, answers, version } = req.body;
    if (!formId || !answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: 'Form ID and responses are required.' });
    }

    // Check if the form exists
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ error: 'Form not found.' });
    }

    // Create a new response document
    const newResponse = new Response({
      formId,
      answers,
      version
    });

    // Save the response to the database
    await newResponse.save();

    res.status(201).json({
      message: 'Response submitted successfully!',
      data: newResponse,
    });
  } catch (error) {
    console.error('Error submitting response:', error);
    res.status(500).json({ error: 'An error occurred while submitting the response.' });
  }
});

// Route to get responses by form ID
router.get('/show-responses/:formId', async (req, res) => {
  const { formId } = req.params;
  try {
    const responses = await Response.find({ formId }).populate('formId');
    if (!responses || responses.length === 0) {
      return res.status(404).json({ success: false, error: 'No responses found for this form' });
    }
    res.status(200).json(responses);
  } catch (error) {
    console.error('Error fetching responses for form:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


module.exports = router;