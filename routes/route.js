const express = require('express');
const router = express.Router();

const Task = require('../models/task')
//Retrieving Data


router.get('/tasks', (req, res) => {
    Task.find(function (err, tasks) {
        res.json(tasks);
    })
});
// Add task
router.post('/task', (req, res, next) => {
    let newTask = new Task({
        task_name: req.body.task_name,
        due_date: req.body.due_date,
        status: req.body.status,
        start_date: req.body.start_date,
        description: req.body.description
    });
    newTask.save((err, task) => {
        if (err) {
            res.json({ msg: 'failed to add task' })
        }
        else {
            res.json({ msg: 'task added successfully' })
        }
    });
});

//Delete Task
router.delete('/task/:id', (req, res, next) => {
    Task.remove({ _id: req.params.id }, function (err, result) {
        if (err) {
            res.json(err);
        }
        else {
            res.json(result);
        }
    })
});


//Update Task
router.put('/task/:id', (req, res, next) => {


    Task.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            task_name: req.body.task_name,
            due_date: req.body.due_date,
            status: req.body.status,
            start_date: req.body.start_date,
            description: req.body.description

        }
    }, function (err, result) {
        if (!result) {
            res.json({ msg: "err" })
        }
        else {
            res.json({ msg: result })
        }
    })
});
module.exports = router;
