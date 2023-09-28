import supertest from 'supertest';
import { expect } from 'chai';
import app from '../../../app';
import { delay } from '../../common/helpers/helpers.functions';
import { CustomerAttributes } from '../../customer/models/customer.model';
import { CreateCustomerDto } from '../../customer/dtos/create.customer.dto';
import customerService from '../../customer/services/customer.service';

const request = supertest(app);

(async function () {
    delay(3);
    let customerBefore: CustomerAttributes;
    describe('CustomerRoutes', () => {
        before(async () => {
            const customerAttr: CreateCustomerDto = {
                email: 'customerBeforeRoutes@email.com',
                address: 'customerBeforeRoutes address',
                firstName: 'customerBeforeRoutes firstName',
                lastName: 'customerBeforeRoutes lastName',
                password: 'customerBeforeRoutes password',
                phone: '12414124124',
            };
            customerBefore = await customerService.create(customerAttr);
        });

        it('should return 200 and the customer', async () => {
            // we need to login first to get the token
        });
    });

    run();
})();
