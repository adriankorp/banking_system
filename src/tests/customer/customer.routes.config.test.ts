import supertest from 'supertest';
import { expect } from 'chai';
import app from '../../../app';
import { delay } from '../../common/utils/utils';

const request = supertest(app);

(async function () {
    delay(3);
    let costumerJwtToken: string;
    describe('CustomerRoutes', () => {
        before(async () => {
            const req = {
                email: 'customerBeforeRoutes@email.com',
                address: 'Addrsesss!',
                firstName: 'customerBeforeRoutes firstName',
                lastName: 'customerBeforeRoutes lastName',
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
        });

        after(async () => {
            app.close();
        });

        it('should return 200 and the customer', async () => {
            // we need to login first to get the token

            const result = await request.get('/customer').set('Authorization', `Bearer ${costumerJwtToken}`);
            const customer = result.body;
            expect(result.status).to.equal(200);
            expect(customer).to.have.property('email');
            expect(customer).to.have.property('firstName');
            expect(customer).to.have.property('lastName');
            expect(customer).to.have.property('address');
            expect(customer).to.have.property('phone');
            expect(customer).to.have.property('account');
            expect(customer.account).to.have.property('accountNumber');
            expect(customer.account).to.have.property('balance');
        });

        it('should update patch the customer', async () => {
            const req = {
                email: 'customerBeforeRoutesPatch@email.com',
            };

            const result = await request
                .patch('/customer')
                .set('Authorization', `Bearer ${costumerJwtToken}`)
                .send(req);
            const customer = result.body;
            expect(result.status).to.equal(200);
            expect(customer.message).to.equal('Customer updated');
        });

        it('should update put the customer', async () => {
            const req = {
                email: 'customerBeforeRoutesPut@email.com',
                address: 'Addrsesss!',
                firstName: 'customerBeforeRoutesPut firstName',
                lastName: 'customerBeforeRoutesPut lastName',
                password: 'StrongPassword1!',
                phone: '12414124124',
            };

            const result = await request.put('/customer').set('Authorization', `Bearer ${costumerJwtToken}`).send(req);

            const customer = result.body;
            expect(result.status).to.equal(200);
            expect(customer.message).to.equal('Customer updated');
        });

        it('should send bad request if put body is missing', async () => {
            const req = {
                email: 'customerBeforeRoutesPut@email.com',
                address: 'Addrsesss!',
                firstName: 'customerBeforeRoutesPut firstName',
                lastName: 'customerBeforeRoutesPut lastName',
            };

            const result = await request.put('/customer').set('Authorization', `Bearer ${costumerJwtToken}`).send(req);

            const customer = result.body;
            expect(result.status).to.equal(400);
        });

        it('should delete the customer', async () => {
            const result = await request.delete('/customer').set('Authorization', `Bearer ${costumerJwtToken}`);
            const customer = result.body;
            expect(result.status).to.equal(200);
            expect(customer.message).to.equal('Customer deleted');
        });

        it('should create a customer', async () => {
            const req = {
                email: 'customerRoutes@email.com',
                address: 'Addrsesss!',
                firstName: 'customerRoutes firstName',
                lastName: 'customerRoutes lastName',
                password: 'StrongPassword1!',
                phone: '12414124124',
            };

            const result = await request.post('/customer').send(req);

            const customer = result.body;

            expect(result.status).to.equal(201);
            expect(customer.message).to.equal('Customer created');
        });
    });

    run();
})();
