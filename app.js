const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoute = require('./api/routes/products');
const orderRoute = require('./api/routes/orders');

mongoose.Promise=global.Promise;
mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://root:root@node-demo.ksfcujo.mongodb.net/node-demo?retryWrites=true&w=majority',{
    // useMongoClint : true,
    useNewUrlParser: true,
});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-headers', 'Origin, X-Requested-With, Content-Type, accept, Authorization');
    if(req.method==='OPTIONS')
    {
        res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
        return res.status(200).json({});
    }
    next();
});

app.use('/products', productRoute);
app.use('/orders', orderRoute);

app.use((req,res,next)=>{
    const error = new Error('not found');
    error.status=404;
    next(error);
});


app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    console.log(error);
    res.json({
        error : {
            message : error.message
        }
    });
});

module.exports = app;