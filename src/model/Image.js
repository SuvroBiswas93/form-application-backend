const mongoose = require('mongoose'); 
  
const imageSchema = new mongoose.Schema({ 

    image: 
    { 
        type: String
    } 
}, {timestamps: true}); 

module.exports = new mongoose.model('Image', imageSchema); 