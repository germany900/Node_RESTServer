/**
 * PUERTO
 */
process.env.PORT = process.env.PORT || 3000;

/**
 *  Enterno
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**
 *  Base de datos
 */

let urlDB;
if(process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://germany900:3l4rt3d3v1v1r@cafe-user.hf3mj.mongodb.net/cafe';
}
process.env.URLDB = urlDB;
