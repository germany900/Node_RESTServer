require('../config/config');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/usuario');
const app = express();

app.post('/login', (req, res) => {
    let body = req.body;

    User.findOne({ email: body.email }, (err, UserDB) => {
        if(err) {
            return res.status(500).json({
                err
            });
        }
        if(!UserDB) {
            return res.status(400).json({
                err: {
                    message: 'User & Password incorrectas...'
                }
            });
        }

        if(!bcrypt.compareSync(body.password, UserDB.password)) {
            return res.status(400).json({
                err: {
                    message: 'User & Password incorrectas...'
                }
            });
        }

        let token = jwt.sign({
            usuario: UserDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            user: UserDB,
            token
        });
    });
});


module.exports = app;