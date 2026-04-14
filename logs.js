const pool = require('./db');

const logAction = async (action, method, route, status, message) => {
    try {
        await pool.query(
            'INSERT INTO logs (action, method, route, status, message) VALUES ($1, $2, $3, $4, $5)',
            [action, method, route, status, message]
        );
    } catch (err) {
        console.log("Failed to write the log:", err.message);
    }
};

module.exports = logAction;
