import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { STATUS, MESSAGE } from '../constants/response.constants';

class BodyValidationMiddleware {
    verifyBodyFieldsErrors(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(STATUS.BAD_REQUEST).send({ errors: [errors] });
        }
        next();
    }
}

export default new BodyValidationMiddleware();
