require('../config/config');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.Client_ID);
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

//configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.Client_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
  }

app.post('/google', async(req, res) => {
    let token = req.body.idtoken;

    let googleUser = await verify(token)
                        .catch(e => {
                            return res.status(403).json({
                                ok: false,
                                err: e
                            });
                        });
                        
    await User.findOne({email: googleUser.email}, (err, UserDB) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if(UserDB) {
            if(UserDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su autenticacion normal'
                    }
                });
            }else {
                let token = jwt.sign({
                    usuario: UserDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
    
                return res.json({
                    ok: true,
                    user: UserDB,
                    token
                });
            } 
        }else {
            // si el usuario no existe en nuestra base de datos
            let user = new User();

            user.nombre = googleUser.nombre;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = true;
            user.password = ':)';

            user.save((err, UserDB) => {
                if(err){
                    return res.status(500).json({
                        ok:false,
                        err
                    });
                };
                let token = jwt.sign({
                    usuario: UserDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
    
                return res.json({
                    ok: true,
                    user: UserDB,
                    token
                });
            });
        }
    });
});

module.exports = app;