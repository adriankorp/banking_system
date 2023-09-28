import express from 'express';
import jwt from 'jsonwebtoken';
import { Jwt } from '../../common/types/jwt.type';
import { JWT_SECRET } from '../../common/constants/env.constants';
import { STATUS } from '../../common/constants/response.constants';

class JwtMiddleware {
    validateJwt(req: express.Request, res: express.Response, next: express.NextFunction) {
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader?.split(' ')[1];

        if (token) {
            try {
                const decoded = jwt.verify(token, JWT_SECRET) as Jwt;
                res.locals.jwt = decoded;

                next();
            } catch (error) {
                res.status(STATUS.UNAUTHORIZED).send();
            }
        } else {
            res.status(STATUS.UNAUTHORIZED).send();
        }
    }
}

export default new JwtMiddleware();
