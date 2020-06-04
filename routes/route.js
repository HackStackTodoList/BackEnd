const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Task = require('../models/task')
const user_auth = require('./user-auth.routes')
// Retrieving Data
router.get('/tasks', (req, res) => {
    Task.find(function (err, tasks) {
        res.json(tasks);
    })
});
// Retrieving Data by status
router.get('/task/status/:status', verifyToken, (req, res) => {
    Task.find({ user_id: req.userId, status: req.params.status },
        function (err, tasks) {
            res.json(tasks);
        })
})
// Add task
router.post('/task', verifyToken, (req, res, next) => {
    let newTask = new Task({
        task_name: req.body.task_name,
        due_date: req.body.due_date,
        status: req.body.status,
        start_date: req.body.start_date,
        description: req.body.description,
        user_id: req.userId
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

function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        res.status(401).send("Unauthorized request")
    }
    let token = req.headers.authorization.split(' ')[1]
    if (token === 'null') {
        res.status(401).send("Unauthorized request")
    }
    let payload = jwt.verify(token, 'anything')
    if (!payload) {
        res.status(401).send("Unauthorized request")
    }
    req.userId = payload.subject
    next()
}

module.exports = router;
