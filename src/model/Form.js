const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const FormSchema = new mongoose.Schema({

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  name: { type: String, required: true },

  description: {
    type: String,
    default: ""
  },
  questions: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Question' }
  ],
  
  isActive : {type: Boolean, default : true},

 }, {timestamps: true});

FormSchema.plugin(mongoosePaginate);
module.exports= mongoose.model('Form', FormSchema);