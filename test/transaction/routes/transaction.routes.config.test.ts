import supertest from 'supertest';
import { expect } from 'chai';
import app from '../../../app';
import { delay } from '../../../src/common/utils/utils';
import { CreateTransactionDto } from '../../../src/transaction/dtos/create.transaction.dto';
import customerService from '../../../src/customer/services/customer.service';
import { CustomerAttributes } from '../../../src/customer/models/customer.model';
import accountService from '../../../src/account/services/account.service';
import { AccountAttributes } from '../../../src/account/models/account.model';

const request = supertest(app);

(async function () {
    delay(3);
    let costumerJwtToken: string;
    let customerFirst;
    let customerSecond;
    let accountSecondCustomer: AccountAttributes;
    describe('CustomerRoutes', () => {
        before(async () => {
            const req = {
                email: 'transactionRoutes@email.com',
                address: 'Addrsesss!',
                firstName: 'transactionRoutes firstName',
                lastName: 'transactionRoutes lastName',
                password: 'StrongPassword1!',
                phone: '12414124124',
            };

            const result = await request.post('/customer').send(req);

            // login
            const loginReq = {
                email: req.email,
                password: req.password,
            };

            const loginResult = await request.post('/login').send(loginReq);

            costumerJwtToken = loginResult.body.token;
            customerFirst = await customerService.getByEmail(req.email);

            customerSecond = await customerService.create({
                ...req,
                email: 'transactionRoutes2@email.com',
            });

            accountSecondCustomer = await accountService.create({
                customerId: customerSecond.id,
            });
        });

        after(async () => {
            app.close();
        });

        it('should return 200 and the transactions', async () => {
            // we need to login first to get the token

            const result = await request.get('/transaction').set('Authorization', `Bearer ${costumerJwtToken}`);
            const { transactions } = result.body;
            expect(result.status).to.equal(200);
            expect(transactions).to.be.an('array');
            expect(transactions.length).to.equal(0);
        });

        it('should return 201 and create a transaction', async () => {
            const req = {
                amount: 100,
                description: 'description',
                title: 'title',
                to: 'to',
                toAccount: accountSecondCustomer.accountNumber,
            };

            const result = await request
                .post('/transaction')
                .set('Authorization', `Bearer ${costumerJwtToken}`)
                .send(req);
            const { transaction, message } = result.body;
            expect(result.status).to.equal(201);
            expect(message).to.equal('Transaction created');
            expect(transaction).to.have.property('id');
            expect(transaction).to.have.property('amount');
            expect(transaction).to.have.property('description');
            expect(transaction).to.have.property('title');
            expect(transaction.amount).to.equal(req.amount);
        });
    });
})();
