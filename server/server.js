"use strict";
require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
 
app.get('/usuario', (req, res) => {
  res.json('get usuario');
});

app.post('/usuario', (req, res) => {
    let body = req.body;

    if(body.nombre === undefined) {
        res.status(400).json({
            message: 'El nombre es necesario!!!'
        })
    }else {
        res.json({
            data: body
        });
    }
});
  

app.post('/usuario/:id', (req, res) => {
    let id = req.params.id;

    res.json({
        id
    })
});

app.put('/usuario', (req, res) => {
    res.json('put usuario');
});

app.delete('/usuario', (req, res) => {
    res.json('delete usuario');
});
 
app.listen(process.env.PORT, () => {
    console.log('Server on port:', process.env.PORT);
});