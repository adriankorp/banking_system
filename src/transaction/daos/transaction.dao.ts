import debug from 'debug';
import { Op } from 'sequelize';
import Transaction, { TransactionAttributes } from '../models/transaction.model';
import { CreateTransactionDto } from '../dtos/create.transaction.dto';

const log: debug.IDebugger = debug('app:transaction-dao');

class TransactionDao {
    private Transaction = Transaction;

    constructor() {
        log('Created new instance of TransactionDao');
    }

    async add(transactionFields: CreateTransactionDto): Promise<TransactionAttributes> {
        const transaction = await this.Transaction.create(transactionFields);
        return transaction;
    }

    async getByIdAndCustomerId(transactionId: number, customerId: string): Promise<TransactionAttributes | null> {
        return this.Transaction.findOne({
            where: { id: transactionId, customerId },
        });
    }

    async getAllByCustomerId(customerId: string, limit = 25, page = 0): Promise<TransactionAttributes[]> {
        const offset = page * limit;
        return this.Transaction.findAll({
            where: { customerId },
            limit,
            offset,
        });
    }

    async getAllByAccountNumber(accountNumber: string, limit = 25, page = 0): Promise<TransactionAttributes[]> {
        const offset = page * limit;
        return this.Transaction.findAll({
            where: {
                [Op.or]: [{ fromAccount: accountNumber }, { toAccount: accountNumber }],
            },
            limit,
            offset,
        });
    }
}

export default new TransactionDao();
