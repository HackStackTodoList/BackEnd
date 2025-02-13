var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var cors = require('cors');
var path = require('path');


var app = express();

const route = require('./routes/task.route');
const authRoutes = require('./routes/user-auth.routes');


const mongoUrl = 'mongodb://localhost:27017/todoList';

// connection to mongodb
mongoose.connect(mongoUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex:true 
});

// success with mongo
mongoose.connection.on('connected', () => {
    console.log('connected to database ');

})

mongoose.connection.on('error', (err) => {
    if (err) {
        console.log('Error in database connection' + err);
    }
})
//port 
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(bodyparser.json());


//add route 
app.use('/api', route)
app.use('/api', authRoutes)
//static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send('foobar');

});

//port bind
app.listen(port, () => {
    console.log('Server Started Successfully at port :' + port);

})