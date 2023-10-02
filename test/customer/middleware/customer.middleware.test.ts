/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import { delay } from '../../../src/common/utils/utils';
import customerMiddleware from '../../../src/customer/middleware/customer.middleware';
import customerService from '../../../src/customer/services/customer.service';
import { CustomerAttributes } from '../../../src/customer/models/customer.model';
import { CreateCustomerDto } from '../../../src/customer/dtos/create.customer.dto';

(async function () {
    await delay(3);

    describe('Customer Middleware', () => {
        let customerBefore: CustomerAttributes;

        before(async () => {
            const customerBeforeParams: CreateCustomerDto = {
                email: 'beforeMiddleware@example.com',
                password: '123456789',
                firstName: 'beforeCustomer',
                lastName: 'beforeCustomer',
                address: 'beforeCustomer',
                phone: '142141242',
            };
            customerBefore = await customerService.create(customerBeforeParams);
        });

        it('should call next when email doesnt exist', async () => {
            let nextCalled = false;
            const req: any = {
                body: {
                    email: 'testDosentExist@example.com',
                },
            };
            const res: any = {
                locals: {},
            };
            const next = () => {
                nextCalled = true;
            };

            await customerMiddleware.validateEmailDoesntExist(req, res, next);
            expect(res.locals).to.be.empty;
            expect(nextCalled).to.be.true;
        });

        it('should call next when customer exists', async () => {
            let nextCalled = false;
            const req: any = {};
            const res: any = {
                locals: {
                    jwt: {
                        id: customerBefore.id,
                    },
                },
            };
            const next = () => {
                nextCalled = true;
            };

            await customerMiddleware.validateCustomerExist(req, res, next);
            expect(nextCalled).to.be.true;
        });

        it('should return 409 and error message when email exists', async () => {
            const req: any = {
                body: {
                    email: customerBefore.email,
                },
            };
            const res: any = {
                status: (code: number) => {
                    expect(code).to.equal(409);
                    return {
                        send: (response: any) => {
                            expect(response.errors[0]).to.equal('Customer email already exists');
                        },
                    };
                },
            };
            const next = () => {};

            await customerMiddleware.validateEmailDoesntExist(req, res, next);
        });

        it('should return 404 and error message when customer doesnt exist', async () => {
            const req: any = {};
            const res: any = {
                locals: {
                    jwt: {
                        id: 'notFound',
                    },
                },
                status: (code: number) => {
                    expect(code).to.equal(404);
                    return {
                        send: (response: any) => {
                            expect(response.errors[0]).to.equal('Customer not found');
                        },
                    };
                },
            };
            const next = () => {};

            await customerMiddleware.validateCustomerExist(req, res, next);
        });
    });

    run();
})();
