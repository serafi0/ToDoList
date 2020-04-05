const mongoose = require('mongoose');

const counterSchema = mongoose.Schema({
    num:Number,
        _id:String
});


module.exports = mongoose.model('Counter', counterSchema);
