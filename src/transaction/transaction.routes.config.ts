import express from 'express';
import debug from 'debug';
import { body } from 'express-validator';
import { CommonRoutesConfig } from '../common/common.routes.config';
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';
import accountMiddleware from '../account/middleware/account.middleware';
import jwtMiddleware from '../authorization/middleware/jwt.middleware';
import transactionMiddleware from './middleware/transaction.middleware';
import transactionController from './controllers/transaction.controller';

const log: debug.IDebugger = debug('app:transaction-routes');

export class Transaction extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'TransactionRoutes');
    }

    configureRoutes() {
        this.app
            .route('/transaction')
            .all(jwtMiddleware.validateJwt)
            .get(transactionController.list)
            .post(
                body('amount').isNumeric(),
                body('toAccount').isString(),
                body('description').optional().isString(),
                body('title').isString(),
                body('to').isString(),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                accountMiddleware.checkRecipientAccountExists,
                accountMiddleware.extractAccountNumber,
            );

        this.app.param('transactionId', transactionMiddleware.extractTransactionId);
        this.app
            .route('/transaction/:transactionId')
            .all(jwtMiddleware.validateJwt)
            .get(transactionMiddleware.checkTransactionExists, transactionController.getById);

        return this.app;
    }
}
