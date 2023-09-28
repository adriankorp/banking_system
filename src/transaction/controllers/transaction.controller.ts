import { Request, Response } from 'express';
import debug from 'debug';
import { STATUS } from '../../common/constants/response.constants';
import transactionService from '../services/transaction.service';

const log: debug.IDebugger = debug('app:transaction-controller');

class TransactionController {
    constructor() {
        log('Created new instance of TransactionController');
    }

    async create(req: Request, res: Response) {
        const { amount, description, title, to, fromAccount, toAccount } = req.body;
        const transaction = await transactionService.create({
            customerId: res.locals.jwt.id,
            amount,
            description,
            title,
            to,
            fromAccount,
            toAccount,
        });

        res.status(STATUS.CREATED).send({
            message: 'Transaction created',
            transaction: {
                id: transaction.id,
                amount: transaction.amount,
                description: transaction.description,
                title: transaction.title,
                to: transaction.to,
                fromAccount: transaction.fromAccount,
                toAccount: transaction.toAccount,
            },
        });
    }

    async getById(req: Request, res: Response) {
        const transaction = await transactionService.readByIdAndCustomerId(req.body.transactionId, res.locals.jwt.id);

        res.status(STATUS.OK).send({
            transaction: {
                id: transaction?.id,
                amount: transaction?.amount,
                description: transaction?.description,
                title: transaction?.title,
                to: transaction?.to,
                fromAccount: transaction?.fromAccount,
                toAccount: transaction?.toAccount,
            },
        });
    }

    async list(req: Request, res: Response) {
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
        const page = req.query.page ? parseInt(req.query.page as string, 10) : 0;
        const transactions = await transactionService.listByCustomerId(res.locals.jwt.id, limit, page);

        res.status(STATUS.OK).send({
            transactions,
        });
    }
}

export default new TransactionController();
