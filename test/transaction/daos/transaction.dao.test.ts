import { expect } from 'chai';
import { delay } from '../../../src/common/utils/utils';
import { CustomerAttributes } from '../../../src/customer/models/customer.model';
import { AccountAttributes } from '../../../src/account/models/account.model';
import customerService from '../../../src/customer/services/customer.service';
import accountService from '../../../src/account/services/account.service';
import transactionDao from '../../../src/transaction/daos/transaction.dao';

(async function () {
    delay(3);

    describe('TransactionDao', () => {
        let beforeCustomer: CustomerAttributes;
        let account: AccountAttributes;

        before(async () => {
            beforeCustomer = await customerService.create({
                email: 'transactionDao@email.com',
                password: 'password',
                firstName: 'transaction',
                lastName: 'dao',
                address: 'address',
                phone: 'phone',
            });

            account = await accountService.create({
                customerId: beforeCustomer.id,
            });
        });

        it('should create a new transaction', async () => {
            const transaction = await transactionDao.add({
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
            const transaction = await transactionDao.getByIdAndCustomerId(1, beforeCustomer.id);
            expect(transaction).to.have.property('id');
            expect(transaction).to.have.property('description');
            expect(transaction).to.have.property('amount');
            expect(transaction).to.have.property('customerId');
            expect(transaction).to.have.property('fromAccount');
            expect(transaction).to.have.property('title');
            expect(transaction).to.have.property('to');
            expect(transaction).to.have.property('toAccount');
        });

        it('should read all transactions by customerId', async () => {
            const transactions = await transactionDao.getAllByCustomerId(beforeCustomer.id);
            expect(transactions).to.be.an('array');
            expect(transactions[0]).to.have.property('id');
            expect(transactions[0]).to.have.property('description');
            expect(transactions[0]).to.have.property('amount');
            expect(transactions[0]).to.have.property('customerId');
            expect(transactions[0]).to.have.property('fromAccount');
            expect(transactions[0]).to.have.property('title');
            expect(transactions[0]).to.have.property('to');
            expect(transactions[0]).to.have.property('toAccount');
        });

        it('should read all transactions by accountNumber', async () => {
            const transactions = await transactionDao.getAllByAccountNumber(account.accountNumber);
            expect(transactions).to.be.an('array');
            expect(transactions[0]).to.have.property('id');
            expect(transactions[0]).to.have.property('description');
            expect(transactions[0]).to.have.property('amount');
            expect(transactions[0]).to.have.property('customerId');
            expect(transactions[0]).to.have.property('fromAccount');
            expect(transactions[0]).to.have.property('title');
            expect(transactions[0]).to.have.property('to');
            expect(transactions[0]).to.have.property('toAccount');
        });
    });

    run();
})();
