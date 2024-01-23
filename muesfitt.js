const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const yourModelSchema = new Schema({
  name: String,
  surname: String
});

const YourModel = mongoose.model('YourModel', yourModelSchema);

module.exports = YourModel;



