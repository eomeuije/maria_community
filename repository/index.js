const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'root1234',
    database: 'maria_community',
    waitForConnections: true,
    connectionLimit: 10
})

module.exports = pool;