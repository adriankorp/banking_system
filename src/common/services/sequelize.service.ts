import { Sequelize, Dialect } from 'sequelize';

import debug from 'debug';

import {
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_USER,
    MYSQL_PASSWORD,
    MYSQL_DATABASE,
} from '../constants/env.constants';

const log: debug.IDebugger = debug('app:sequelize-service');

class SequelizeService {
    private count = 0;

    private sequelizeOptions = {
        host: MYSQL_HOST,
        port: MYSQL_PORT,
        username: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: MYSQL_DATABASE,
        dialect: 'mysql' as Dialect,
        logging: false,
    };

    constructor() {
        this.connectWithRetry();
    }

    private sequelize: Sequelize | undefined;

    getSequelize() {
        return this.sequelize!;
    }

    async connectWithRetry() {
        this.count += 1;

        try {
            log('Attempting MySQL connection (will retry if needed)');
            this.sequelize = new Sequelize(this.sequelizeOptions);
            await this.sequelize.authenticate();
            await this.sequelize.sync({
                alter: true,
                logging: false,
                force: true,
            });
            log('MySQL connected');
            console.log('MySQL connected');
        } catch (err) {
            log('MySQL connection failed');
            console.log('MySQL connection failed', err);
            const timeout = this.count < 30 ? 2000 : 10000;
            log(`Retrying in ${timeout / 1000} seconds`);
            setTimeout(this.connectWithRetry.bind(this), timeout);
        }
    }
}

export default new SequelizeService();
