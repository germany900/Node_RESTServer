const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../model/usuario');
const { verifyToken, verifyRol } = require('../middlewares/autenticacion');
const app = express();

app.get('/usuario', verifyToken, async(req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    await User.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if(err){
                return res.status(400).json({
                    err
                })
            }
            User.count({ estado: true }, (err, conteo) => {
                res.json({
                    UserInDB: conteo,
                    usuarios
                })
            });
        });
  });
  
  app.post('/usuario', [verifyToken, verifyRol], async(req, res) => {
      let body = req.body;

        let user = new User({
            nombre: body.nombre,
            email: body.email,
            password: bcrypt.hashSync(body.password, 12),
            role: body.role
        });

        await user.save((err, userDB) => {
            if(err) {
                return res.status(400).json({
                    err
                });
            }
            res.json({
                user: userDB
            })
        });
  });
    
  
  app.post('/usuario/:id', (req, res) => {
      let id = req.params.id;
  
      res.json({
          id
      })
  });
  
  app.put('/usuario/:id', [verifyToken, verifyRol], async(req, res) => {
      let id = req.params.id;
      let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

      await User.findByIdAndUpdate(id,
         body,
          { new: true, runValidators: true },
           (err, userDB) => {
        if(err) {
            return res.status(400).json({
                err
            });
        }
        res.json({
            user: userDB
        })
      });
  });
  
  app.delete('/usuario/:id', [verifyToken, verifyRol], async(req, res) => {
      
        let id = req.params.id;
        let updateState = { estado: false };

        await User.findByIdAndUpdate(id,
            updateState,
             { new: true },
              (err, UserStatus) => {
            if(err) {
                return res.status(400).json({
                    err
                });
            };

            res.json({
                message: 'Se elimino el usuario',
                user: UserStatus
            })
        });
  });


module.exports = app;