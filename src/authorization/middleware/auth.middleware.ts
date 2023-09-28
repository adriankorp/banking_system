import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import customerService from '../../customer/services/customer.service';

class AuthMiddleware {
    async verifyUserPassword(req: Request, res: Response, next: NextFunction) {
        const customer = await customerService.getByEmail(req.body.email);

        if (customer && (await bcrypt.compare(req.body.password, customer.password))) {
            req.body = {
                customerId: customer.id,
            };
            return next();
        }

        res.status(400).send({ errors: ['Invalid email or password'] });
    }
}

export default new AuthMiddleware();
