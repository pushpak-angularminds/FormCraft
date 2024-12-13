const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the form the response is for
    required: true,
    ref: 'Form',
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  version: {
    type: Number, // The version of the form when the response was submitted
    required: true,
  },
  answers: [
    {
      question: {
        type: String, // The question text
        required: true,
      },
      answer: {
        type: mongoose.Schema.Types.Mixed, // Flexible type to support different answers (string, array, file info)
        // required: true,
      },
    },
  ],
})

const Response = mongoose.model('Response', responseSchema);

module.exports = Response;


