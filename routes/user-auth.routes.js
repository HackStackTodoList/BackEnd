const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// get all users
router.get('/auth', (req, res) => {
    User.find(function (err, user) {
        res.json(user);
    })
})

// Register new user
router.post('/register', (req, res, next) => {
    let newUser = new User(req.body);
    newUser.save((err, user) => {
        if (err) {
            res.status(401).send('Error')
        }
        else {
            let payload = { subject: user._id }
            let token = jwt.sign(payload, 'anything')
            res.status(200).send({ token })
            /*res.status(200).send('success');*/
        }
    });


})

// Find by userId
router.post('/login', (req, res, next) => {
    User.findOne({ username: req.body.username }, function (err, user) {
        if (err) {
            console.log(err);
        }
        else {
            if (!user) {
                res.status(401).send('Invalid username or password')
            } else if (user.password != req.body.password) {
                res.status(401).send('Invalid username or password')
            }
            else {
                let payload = { subject: user._id }
                let token = jwt.sign(payload, 'anything')
                res.status(200).send({ token })
                //res.status(200).send('success');
            }
        }
    })
})
router.get('/user-name', (req, res) => {
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
    id = payload.subject
    User.findOne({_id:id},function (err, user) {
        res.json(user.name);
    })
})


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
