const mongoose =require('mongoose');
const Schema = mongoose.Schema;
const TaskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum:["pending" , "completed"],
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    category:{
        type : String,
        required : true
    },
    dueAt:{
        type: String,
        required: true
    },
    createdByUser:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;