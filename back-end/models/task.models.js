const mongoose = require('mongoose');

const TaskSchema = mongoose.Schema({
    content: String,
    discription: String,
    done: Boolean,
    _id:String,

}, {
    timestamps: true
});



module.exports = mongoose.model('Task', TaskSchema);

