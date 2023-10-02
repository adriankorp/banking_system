import { expect } from 'chai';
import { delay } from '../../../src/common/utils/utils';
import { CustomerAttributes } from '../../../src/customer/models/customer.model';
import { AccountAttributes } from '../../../src/account/models/account.model';
import customerService from '../../../src/customer/services/customer.service';
import accountService from '../../../src/account/services/account.service';
import transactionService from '../../../src/transaction/services/transaction.service';
import { TransactionAttributes } from '../../../src/transaction/models/transaction.model';

(async function () {
    delay(3);

    describe('TransactionService', () => {
        let beforeCustomer: CustomerAttributes;
        let account: AccountAttributes;
        let transaction: TransactionAttributes;

        before(async () => {
            beforeCustomer = await customerService.create({
                email: 'transactionService@emial.com',
                password: 'password',
                firstName: 'transaction',
                lastName: 'service',
                address: 'address',
                phone: 'phone',
            });

            account = await accountService.create({
                customerId: beforeCustomer.id,
            });
        });

        it('should create a new transaction', async () => {
            transaction = await transactionService.create({
                amount: 100,
                customerId: beforeCustomer.id,
                description: 'description',
                fromAccount: account.accountNumber,
                title: 'title',
                to: 'to',
                toAccount: 'toAccount',
            });
            expect(transaction).to.have.property('id');
            expect(transaction).to.have.property('description');
            expect(transaction).to.have.property('amount');
            expect(transaction).to.have.property('customerId');
            expect(transaction).to.have.property('fromAccount');
            expect(transaction).to.have.property('title');
            expect(transaction).to.have.property('to');
            expect(transaction).to.have.property('toAccount');
            expect(transaction.amount).to.equal(100);
        });

        it('should read a transaction by id and customerId', async () => {
            const transactionResult = await transactionService.readByIdAndCustomerId(transaction.id, beforeCustomer.id);
            expect(transactionResult).to.have.property('id');
            expect(transactionResult).to.have.property('description');
            expect(transactionResult).to.have.property('amount');
            expect(transactionResult).to.have.property('customerId');
            expect(transactionResult).to.have.property('fromAccount');
            expect(transactionResult).to.have.property('title');
            expect(transactionResult).to.have.property('to');
            expect(transactionResult).to.have.property('toAccount');
            expect(transactionResult?.amount).to.equal(100);
        });

        it('should read all transactions by customerId', async () => {
            const transactions = await transactionService.listByCustomerId(beforeCustomer.id, 10, 0);
            expect(transactions).to.have.length.greaterThan(0);
        });

        it('should list by account number', async () => {
            const transactions = await transactionService.listByAccountNumber(account.accountNumber, 10, 0);
            expect(transactions).to.have.length.greaterThan(0);
        });
    });
})();
