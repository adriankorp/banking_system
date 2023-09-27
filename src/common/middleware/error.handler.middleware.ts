import debug from 'debug';
import { Request, Response, NextFunction } from 'express';
import { STATUS, MESSAGE } from '../constants/response.constants';

const log: debug.IDebugger = debug('app:error-handler-middleware');

class ErrorHandlerMiddleware {
    handleError(error: any, req: Request, res: Response, next: NextFunction) {
        log(error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send({
            errors: [MESSAGE.INTERNAL_SERVER_ERROR],
        });
    }

    invalidPath(req: Request, res: Response, next: NextFunction) {
        res.status(STATUS.NOT_FOUND).send({
            errors: ['Invalid path'],
        });
    }
}

export default new ErrorHandlerMiddleware();
