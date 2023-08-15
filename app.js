const express = require('express');
require("express-async-errors");
const morgan = require('morgan');
const { errorHandler } = require("./middlewares/error");
require('./db');
require('dotenv').config();
const userRouter = require('./routes/user');


const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/user', userRouter);

app.use(errorHandler);


app.listen(8000, () =>{
    console.log('the port is listening on 8000');
});