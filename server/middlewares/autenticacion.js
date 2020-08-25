require('../config/config');
const jwt = require('jsonwebtoken');

/**
 *  Verificar token
 */
let verifyToken = (req, res, next) => {
    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if(err) {
            return res.status(401).json({
                err: {
                    message: 'Usuario no autenticado!!!!'
                }
            });
        }
        console.log(decoded);
        req.user = decoded.usuario;

        next();
    });

};

/**
 *  Verificar Role
 */
let verifyRol = (req, res, next) => {
    let usuario = req.user;
    console.log(usuario);

    if(usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    }else {
        res.json({
            err: {
                message: 'El usuario no es administrador!!!'
            }
        });
    }
};


module.exports = {
    verifyToken,
    verifyRol
}