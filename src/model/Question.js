const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  type: { type: String, enum: ['text', 'radio', 'checkbox', 'color'], required: true },
  options: [{
    optionText : String,
    optionImage: {type: String, default: ""},
  }],
  required: { type: Boolean, default: false },
  form: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
},{timestamps: true});

// Apply pagination plugin
questionSchema.plugin(mongoosePaginate);

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;