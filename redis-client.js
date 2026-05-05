const redis = require('redis');

const redisClient = redis.createClient({url: 'redis://127.0.0.1:6379'});

redisClient.on('error', (err)=> {
    console.error('Redis error:', err.message);
});

redisClient.on('connect', () => {
    console.log("Connected to redis");
});

module.exports = redisClient;

