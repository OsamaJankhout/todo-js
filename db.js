const { Pool } = require('pg');

const pool = new Pool({
user: 'apiuser',
host: 'localhost',
database: 'test',
password: '1234', 
port: 5432
});

module.exports = pool;
