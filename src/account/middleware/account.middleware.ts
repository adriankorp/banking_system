import { NextFunction, Request, Response } from 'express';
import { STATUS } from '../../common/constants/response.constants';
import accountService from '../services/account.service';

class AccountMiddleware {
    async checkRecipientAccountExists(req: Request, res: Response, next: NextFunction) {
        const account = await accountService.readByAccountNumber(req.body.toAccount);
        if (account) {
            next();
        } else {
            res.status(STATUS.NOT_FOUND).send({
                errors: ['Recipient account not found'],
            });
        }
    }

    async extractAccountNumber(req: Request, res: Response, next: NextFunction) {
        const customerAccount = await accountService.readByCustomerId(res.locals.jwt.id);
        if (customerAccount) {
            req.body.fromAccount = customerAccount.accountNumber;
            next();
        } else {
            res.status(STATUS.NOT_FOUND).send({
                errors: ['Account not found'],
            });
        }
    }
}

export default new AccountMiddleware();
