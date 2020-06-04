const mongoose = require('mongoose');

const TaskSchema = mongoose.Schema({
    task_name: {
        type: String,
        required: true
    },
    due_date: {
        type: Date,
        required: false
    },
    status: {
        type: String,
        required: true
    },
    start_date: {
        type: Date,
        required: false
    },
    description: {
        type: String,
        required: true
    },
    user_id:{
        type: String,
        reruired:true
    }
});

const Task = module.exports = mongoose.model('Task', TaskSchema);
