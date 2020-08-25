"use strict";
require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

// Rutas globales
app.use(require('./routes/index'));
 

mongoose
    .connect(process.env.URLDB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('DB is running');
    })
    .catch(err => console.log(`No se puedo conectar a la DB por ${err}`));
 
app.listen(process.env.PORT, () => {
    console.log('Server on port:', process.env.PORT);
});