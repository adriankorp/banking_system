import { Request, Response, NextFunction } from 'express';
import debug from 'debug';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../common/constants/env.constants';
import { STATUS } from '../../common/constants/response.constants';

const log: debug.IDebugger = debug('app:auth-controller');

class AuthController {
    async createJwt(req: Request, res: Response, next: NextFunction) {
        try {
            const token = jwt.sign(
                {
                    id: req.body.customerId,
                },
                JWT_SECRET,
                {
                    expiresIn: process.env.JWT_TTL,
                },
            );
            res.status(STATUS.CREATED).send({ token });
        } catch (err) {
            next(err);
        }
    }
}

export default new AuthController();
