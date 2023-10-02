import { expect } from 'chai';
import { delay } from '../../../src/common/utils/utils';
import { CustomerAttributes } from '../../../src/customer/models/customer.model';
import { AccountAttributes } from '../../../src/account/models/account.model';
import customerService from '../../../src/customer/services/customer.service';
import accountService from '../../../src/account/services/account.service';
import transactionService from '../../../src/transaction/services/transaction.service';
import transactionMiddleware from '../../../src/transaction/middleware/transaction.middleware';

(async function () {
    delay(3);

    describe('TransactionMiddleware', () => {
        let beforeCustomer: CustomerAttributes;
        let account: AccountAttributes;

        before(async () => {
            beforeCustomer = await customerService.create({
                email: 'transactionMiddleware@email.com',
                password: 'password',
                firstName: 'transaction',
                lastName: 'middleware',
                address: 'address',
                phone: 'phone',
            });

            account = await accountService.create({
                customerId: beforeCustomer.id,
            });
        });

        it('extracts transactions id from request', async () => {
            const req: any = {
                params: {
                    transactionId: '1',
                },
                body: {},
            };
            const res: any = {};
            const next: any = () => {};
            await transactionMiddleware.extractTransactionId(req, res, next);
            expect(req.body.transactionId).to.equal('1');
        });

        it('checks if transaction exists', async () => {
            let nextCalled = false;
            const transaction = await transactionService.create({
                amount: 100,
                customerId: beforeCustomer.id,
                description: 'description',
                fromAccount: account.accountNumber,
                title: 'title',
                to: 'to',
                toAccount: 'toAccount',
            });

            const req: any = {
                body: { transactionId: transaction.id },
            };
            const res: any = {
                locals: {
                    jwt: {
                        id: beforeCustomer.id,
                    },
                },
            };
            const next: any = () => {
                nextCalled = true;
            };
            await transactionMiddleware.checkTransactionExists(req, res, next);
            expect(nextCalled).to.equal(true);
        });
    });

    run();
})();
