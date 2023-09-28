import * as dotenv from 'dotenv';

const dotenvResult = dotenv.config();
if (dotenvResult.error) {
    throw dotenvResult.error;
}

export const API_PORT = Number(process.env.API_PORT);
export const MYSQL_HOST = String(process.env.MYSQL_HOST);
export const MYSQL_PORT = Number(process.env.MYSQL_PORT);
export const MYSQL_USER = String(process.env.MYSQL_USER);
export const MYSQL_PASSWORD = String(process.env.MYSQL_PASSWORD);
export const MYSQL_DATABASE = String(process.env.MYSQL_DATABASE);
export const JWT_SECRET = String(process.env.JWT_SECRET);
export const JWT_TTL = String(process.env.JWT_TTL);
