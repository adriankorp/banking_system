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

    async checkAccountHasEnoughFunds(req: Request, res: Response, next: NextFunction) {
        const customerAccount = await accountService.readByCustomerId(res.locals.jwt.id);
        if (customerAccount && customerAccount.balance >= req.body.amount) {
            next();
        } else {
            res.status(STATUS.NOT_FOUND).send({
                errors: ['Account does not have enough funds'],
            });
        }
    }

    async changeAccountsBalance(req: Request, res: Response, next: NextFunction) {
        const customerAccount = await accountService.readByCustomerId(res.locals.jwt.id);
        const recipientAccount = await accountService.readByAccountNumber(req.body.toAccount);
        if (customerAccount && recipientAccount) {
            customerAccount.balance -= req.body.amount;
            recipientAccount.balance += req.body.amount;
            await customerAccount.save();
            await recipientAccount.save();
            next();
        } else {
            res.status(STATUS.NOT_FOUND).send({
                errors: ['Account not found'],
            });
        }
    }

    async cantTransferToSameAccount(req: Request, res: Response, next: NextFunction) {
        const customerAccount = await accountService.readByCustomerId(res.locals.jwt.id);
        if (customerAccount && customerAccount.accountNumber !== req.body.toAccount) {
            next();
        } else {
            res.status(STATUS.NOT_FOUND).send({
                errors: ['You cannot transfer money to your own account'],
            });
        }
    }
}

export default new AccountMiddleware();
