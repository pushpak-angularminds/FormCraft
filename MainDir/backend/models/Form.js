const mongoose = require('mongoose');


const questionTypes = [
  'text',          // Text input
  'checkbox',      // Checkbox input
  'multipleChoice',// Multiple Choice
  'radio',         // Radio Button
  'fileUpload',    // File Upload
  'dropdown',      // Dropdown input
  'date',          // Date input
];


const formSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the admin who created the form
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  version: {
    type: Number,
    default: 1, // Default version is 1
  },
  questions: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
      },
      type: {
        type: String,
        required: true,
        enum: questionTypes, // Restrict to the array of allowed question types
      },
      question: {
        type: String,
        required: true
      },
      options: {
        type: [String], // Only for fields like 'checkbox' or 'dropdown'
      },
      required: {
        type: Boolean,
        default: false,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Form = mongoose.model('Form', formSchema);

module.exports = Form;
