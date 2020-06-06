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
// Retrieving Data by category
router.get('/task/category/:category', verifyToken, (req, res) => {
    Task.find({ user_id: req.userId, category: req.params.category, status: "Running" },
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
        description: req.body.description,
        category: req.body.category,
        user_id: req.userId
    });
    newTask.save((err, task) => {
        if (err) {
            res.status(401).send('failed to add task')
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
            res.status(401).send('failed to delete task')
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
            status: req.body.status
        }
    }, function (err, result) {
        if (!result) {
            res.status(401).send('failed to update task')
        }
        else {
            res.json({ msg: "Task updated successfully" })
        }
    })
});
//category list
router.get('/categoryList', (req, res) => {
    Task.find(function (err, tasks) {

        var List = [];
        var i, len;
        for (i = 0, len = tasks.length; i < len; i++) {
            List.push(tasks[i].category);
        }
        var unique = List.filter(onlyUnique);
        res.json(unique)
    })
})

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

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
