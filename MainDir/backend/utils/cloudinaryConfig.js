// cloudinaryConfig.js
const cloudinary = require('cloudinary').v2;
// require('dotenv').config();

cloudinary.config({
    cloud_name: 'dmbb5jx8o', 
    api_key: '994477382746437', 
    api_secret: 'uczJlajowEfU-eVj1fVhc1wtU7w' 
});

module.exports = cloudinary;
