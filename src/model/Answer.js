const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const answerSchema = new mongoose.Schema({
  response: { type: mongoose.Schema.Types.ObjectId, ref: 'Response', required: true },
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  answer: {type: String}
},
{ timestamps: true }
);

answerSchema.plugin(mongoosePaginate);

const Answer = mongoose.model('Answer', answerSchema);
module.exports = Answer;