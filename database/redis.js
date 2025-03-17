import { createClient } from 'redis';
import {REDIS_USERNAME, REDIS_PASSWORD, REDIS_HOST, REDIS_PORT, NODE_ENV} from "../config/env.js";

// Create a singleton instance
let client = null;

const createRedisClient = () => {
    if (client) return client;
    
    client = createClient({
        username: REDIS_USERNAME,
        password: REDIS_PASSWORD,
        socket: {
            host: REDIS_HOST,
            port: REDIS_PORT
        },
        // Add retry strategy
        retry_strategy: function(options) {
            if (options.error && options.error.code === 'ECONNREFUSED') {
                // End reconnecting on a specific error
                return new Error('The server refused the connection');
            }
            if (options.total_retry_time > 1000 * 60 * 5) {
                // End reconnecting after a specific timeout
                return new Error('Retry time exhausted');
            }
            if (options.attempt > 10) {
                // End reconnecting with built in error
                return undefined;
            }
            // Exponential backoff (2^attempt * 100ms)
            return Math.min(Math.pow(2, options.attempt) * 100, 3000);
        }
    });

    client.on('connect', () => {
        console.log("Redis Client Connected");
    });

    client.on('ready', () => {
        console.log("Redis Client Ready");
    });

    client.on('error', (err) => {
        console.error("Redis Client Error:", err.message);
    });

    client.on('end', () => {
        console.log("Redis Client Disconnected");
    });

    // When client reconnects after disconnection
    client.on('reconnecting', () => {
        console.log("Attempting to reconnect...");
    });

    // When client receives warning
    client.on('warning', (warning) => {
        console.warn("Redis warning:", warning);
    });

    // Handle multiple termination signals
    ['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(signal => {
        process.on(signal, async () => {
            try {
                await client.quit();
                console.log('Redis connection closed gracefully');
                process.exit(0);
            } catch (err) {
                console.error('Error closing Redis connection:', err);
                process.exit(1);
            }
        });
    });

    return client;
};

const connectRedis = async () => {
    try {
        client = createRedisClient();
        await client.connect();
        console.log(`Connected to Redis in ${NODE_ENV} mode`);
        
        // Add a ping test to verify connection
        await client.ping();
        console.log('Redis connection verified with PING');
    } catch (error) {
        console.error("Error connecting to Redis:", error.message);
        process.exit(1);
    }
};

export { connectRedis, client };
export default connectRedis;