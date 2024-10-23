const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const ResponseSchema = new mongoose.Schema({
  form: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
 answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }]
},  {timestamps: true});

ResponseSchema.plugin(mongoosePaginate);
const Response = mongoose.model('Response', ResponseSchema);
module.exports = Response;