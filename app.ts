import express, { Request, Response, NextFunction } from 'express';
import * as http from 'http';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import * as dotenv from 'dotenv';
import cors from 'cors';
import debug from 'debug';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import sequelizeService from './src/common/services/sequelize.service';
import { API_PORT } from './src/common/constants/env.constants';
import { STATUS } from './src/common/constants/response.constants';

import { CommonRoutesConfig } from './src/common/common.routes.config';


const app: express.Application = express();
const server: http.Server = http.createServer(app);
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug('app');

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
    }),
);

const loggerOptions: expressWinston.LoggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true }),
    ),
};

if (!process.env.DEBUG) {
    loggerOptions.meta = false;
    if (typeof global.it === 'function') {
        loggerOptions.level = 'http'; // for non-debug test runs, squelch entirely
    }
}

app.use(expressWinston.logger(loggerOptions));


const runningMessage = `Server is listening on port ${API_PORT}`;
app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.status(STATUS.OK).send(runningMessage);
});

export default server.listen(API_PORT, () => {
    routes.forEach((route: CommonRoutesConfig) => {
        debugLog(`Routes configured for ${route.getName()}`);
    });
    console.log(runningMessage);
});

