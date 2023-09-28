import { NextFunction, Request, Response } from 'express';
import { STATUS } from '../../common/constants/response.constants';
import transactionService from '../services/transaction.service';

class TransactionMiddleware {
    async extractTransactionId(req: Request, res: Response, next: NextFunction) {
        req.body.transactionId = req.params.transactionId;
        next();
    }

    async checkTransactionExists(req: Request, res: Response, next: NextFunction) {
        const transaction = await transactionService.readByIdAndCustomerId(req.body.transactionId, res.locals.jwt.id);
        if (transaction) {
            next();
        } else {
            res.status(STATUS.NOT_FOUND).send({
                errors: ['Transaction not found'],
            });
        }
    }
}

export default new TransactionMiddleware();
