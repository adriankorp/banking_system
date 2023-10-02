import { expect } from 'chai';
import { delay } from '../../../src/common/utils/utils';
import { CustomerAttributes } from '../../../src/customer/models/customer.model';
import customerService from '../../../src/customer/services/customer.service';
import { AccountAttributes } from '../../../src/account/models/account.model';
import accountDao from '../../../src/account/daos/account.dao';
import accountMiddleware from '../../../src/account/middleware/account.middleware';

(async function () {
    await delay(3);

    describe('AccountMiddleware', () => {
        let beforeCustomer: CustomerAttributes;
        let account: AccountAttributes;
        before(async () => {
            beforeCustomer = await customerService.create({
                email: 'accountMiddleware@email.com',
                firstName: 'Account',
                lastName: 'Middleware',
                password: 'accountMiddleware',
                address: 'Account Middleware Address',
                phone: '1234567890',
            });
        });

        it('checkRecipientAccountExists should return true if account exists', async () => {
            let nextCalled = false;

            account = await accountDao.add({
                customerId: beforeCustomer.id,
            });

            const req: any = {
                body: {
                    toAccount: account.accountNumber,
                },
            };
            const res: any = {};

            const next = () => {
                nextCalled = true;
            };

            await accountMiddleware.checkRecipientAccountExists(req, res, next);
        });

        it('should return error if account doesnt exist', async () => {
            const req: any = {
                body: {
                    toAccount: '1234567890',
                },
            };

            const res: any = {
                status: (code: number) => {
                    return {
                        send: (body: any) => {
                            expect(code).to.be.equal(404);
                            expect(body).to.have.property('errors');
                            expect(body.errors).to.be.an('array');
                            expect(body.errors[0]).to.be.equal('Recipient account not found');
                        },
                    };
                },
            };

            const next = () => {};

            await accountMiddleware.checkRecipientAccountExists(req, res, next);
        });

        it('extractAccountNumber should extract account number from jwt', async () => {
            let nextCalled = false;

            const req: any = {
                body: {
                    fromAccount: '',
                },
            };
            const res: any = {
                locals: {
                    jwt: {
                        id: beforeCustomer.id,
                    },
                },
            };

            const next = () => {
                nextCalled = true;
            };

            await accountMiddleware.extractAccountNumber(req, res, next);

            expect(req.body.fromAccount).to.be.equal(account.accountNumber);
        });

        it('should return error if account doesnt exist', async () => {
            const req: any = {};
            const res: any = {
                locals: {
                    jwt: {
                        id: '1234567890',
                    },
                },
                status: (code: number) => {
                    return {
                        send: (body: any) => {
                            expect(code).to.be.equal(404);
                            expect(body).to.have.property('errors');
                            expect(body.errors).to.be.an('array');
                            expect(body.errors[0]).to.be.equal('Account not found');
                        },
                    };
                },
            };

            const next = () => {};

            await accountMiddleware.extractAccountNumber(req, res, next);
        });

        it('checkAccountHasEnoughFunds should return true if account has enough funds', async () => {
            let nextCalled = false;

            const req: any = {
                body: {
                    amount: 100,
                },
            };
            const res: any = {
                locals: {
                    jwt: {
                        id: beforeCustomer.id,
                    },
                },
            };

            const next = () => {
                nextCalled = true;
            };

            await accountMiddleware.checkAccountHasEnoughFunds(req, res, next);
        });

        it('should return error if account doesnt have enough funds', async () => {
            const req: any = {
                body: {
                    amount: 100000,
                },
            };

            const res: any = {
                locals: {
                    jwt: {
                        id: beforeCustomer.id,
                    },
                },
                status: (code: number) => {
                    return {
                        send: (body: any) => {
                            expect(code).to.be.equal(404);
                            expect(body).to.have.property('errors');
                            expect(body.errors).to.be.an('array');
                            expect(body.errors[0]).to.be.equal('Account does not have enough funds');
                        },
                    };
                },
            };
        });

        it('changeAccountsBalance should change accounts balance', async () => {
            let nextCalled = false;

            const req: any = {
                body: {
                    amount: 100,
                    toAccount: account.accountNumber,
                },
            };
            const res: any = {
                locals: {
                    jwt: {
                        id: beforeCustomer.id,
                    },
                },
            };

            const next = () => {
                nextCalled = true;
            };

            await accountMiddleware.changeAccountsBalance(req, res, next);
        });

        it('cantTransferToSameAccount if account is not the same cant transfer', async () => {
            let nextCalled = false;

            const req: any = {
                body: {
                    toAccount: account.accountNumber,
                },
            };
            const res: any = {
                locals: {
                    jwt: {
                        id: beforeCustomer.id,
                    },
                },
                status: (code: number) => {
                    return {
                        send: (body: any) => {
                            expect(code).to.be.equal(404);
                            expect(body).to.have.property('errors');
                            expect(body.errors).to.be.an('array');
                            expect(body.errors[0]).to.be.equal('You cannot transfer money to your own account');
                        },
                    };
                },
            };

            const next = () => {
                nextCalled = true;
            };

            await accountMiddleware.cantTransferToSameAccount(req, res, next);
        });
    });

    run();
})();
