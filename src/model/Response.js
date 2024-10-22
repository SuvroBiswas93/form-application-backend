const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const ResponseSchema = new mongoose.Schema({

  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form'
  },

  userId: {
    type: String    
  },

  response : [{
      questionId: String,
      optionId: String,
  }],
  
 }, {timestamps: true});

ResponseSchema.plugin(mongoosePaginate);
Response = mongoose.model('Response', ResponseSchema ,'Response');

module.exports = Response; 