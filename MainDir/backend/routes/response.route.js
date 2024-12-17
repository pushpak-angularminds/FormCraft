const express = require('express');
const router = express.Router();
const Form = require('../models/Form'); // Assuming the Form schema is in the `models` folder
const { default: mongoose } = require('mongoose');
const Response = require('../models/Response');
const multer = require('multer');
const { upload, uploadToCloudinary } = require('../middlewares/multer.middleware');


router.post('/form-response', upload.any(), async (req, res) => {
  try {
    console.log('req.body-->', req.body);
    console.log('req.files-->', req.files);

    const { formId, version, answers } = req.body;

    const processedAnswers = await Promise.all(
      answers.map(async (data, index) => {
        //This line will always care to check if there is file at current element of answer 
        const answerFiles = req.files.filter(file => file.fieldname === `answers[${index}][answer]`);

        console.log('firstanswerFiles-->', answerFiles)
        // IF file appears at any index 
        if (answerFiles.length > 0) {
          // Upload files to Cloudinary and replace the local path with the URL
          const cloudinaryUrls = await Promise.all(
            answerFiles.map(async (file) => {
              const url = await uploadToCloudinary(file.path);
              // Optionally delete the file from the local server after uploading to Cloudinary
              // await fs.unlink(file.path);
              return url;
            })
          );
          console.log('obj', {
            ...data,        //This is actually rest of 
            answer: cloudinaryUrls,
          })
          return {
            ...data,
            answer: cloudinaryUrls,
          };
        }
        // if no file return object as it is.
        return data;
      })
    );

    console.log('processedAnswers->', processedAnswers);

    // Save the response to the database (example)
    await Response.create({ formId, version, answers: processedAnswers });

    res.status(201).json({ message: 'Form response submitted successfully' });
  } catch (error) {
    console.error('Error processing form response:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
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