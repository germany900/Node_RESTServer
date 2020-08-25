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
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

/**
 *  Vencimiento Token
 */

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30

/**
 * SEED
 */

process.env.SEED = process.env.SEED || '9uhm4!RW@8!%BeahU2EejG?JfKgCV!';