import { NextFunction, Request, Response } from 'express';
import customerService from '../services/customer.service';
import { STATUS } from '../../common/constants/response.constants';

class CustomerMiddleware {
    async validateEmailDoesntExist(req: Request, res: Response, next: NextFunction) {
        const customer = await customerService.getByEmail(req.body.email);
        if (customer) {
            res.status(STATUS.CONFLICT).send({
                errors: ['Customer email already exists'],
            });
        } else {
            next();
        }
    }

    async validateCustomerExist(req: Request, res: Response, next: NextFunction) {
        const customer = await customerService.readById(res.locals.jwt.id);
        if (customer) {
            next();
        } else {
            res.status(STATUS.NOT_FOUND).send({
                errors: ['Customer not found'],
            });
        }
    }
}

export default new CustomerMiddleware();
