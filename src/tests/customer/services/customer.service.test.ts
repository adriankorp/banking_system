/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import { delay } from '../../../common/utils/utils';
import customerService from '../../../customer/services/customer.service';
import { CustomerAttributes } from '../../../customer/models/customer.model';
import { CreateCustomerDto } from '../../../customer/dtos/create.customer.dto';
import { PatchCustomerDto } from '../../../customer/dtos/patch.customer.dto';
import { PutCustomerDto } from '../../../customer/dtos/put.customer.dto';

(async function () {
    await delay(3);

    describe('Customer Service', () => {
        let customerBefore: CustomerAttributes;

        before(async () => {
            const customerBeforeParams: CreateCustomerDto = {
                email: 'beforeService@email.com',
                password: '123456789',
                firstName: 'beforeService',
                lastName: 'beforeService',
                address: 'beforeService',
                phone: '142141242',
            };
            customerBefore = await customerService.create(customerBeforeParams);
        });

        // creates a new customer and returns its attributes
        it('should create a new customer and return its attributes', async () => {
            const resource: CreateCustomerDto = {
                email: 'testService@example.com',
                password: 'password',
                firstName: 'John',
                lastName: 'Doe',
                address: '123 Main St',
                phone: '123-456-7890',
            };
            const customerAttributes = await customerService.create(resource);
            expect(customerAttributes).to.have.property('id');
            expect(customerAttributes.email).to.equal(resource.email);
            expect(customerAttributes.password).to.equal(resource.password);
            expect(customerAttributes.firstName).to.equal(resource.firstName);
            expect(customerAttributes.lastName).to.equal(resource.lastName);
            expect(customerAttributes.address).to.equal(resource.address);
            expect(customerAttributes.phone).to.equal(resource.phone);
        });

        it('should return a customer by ID when a valid ID is provided', async () => {
            const customerId = customerBefore.id;
            const customerAttributes = await customerService.readById(customerId);

            expect(customerAttributes).to.have.property('id');
            expect(customerAttributes?.email).to.equal(customerBefore.email);
            expect(customerAttributes?.password).to.equal(customerBefore.password);
            expect(customerAttributes?.firstName).to.equal(customerBefore.firstName);
            expect(customerAttributes?.lastName).to.equal(customerBefore.lastName);
            expect(customerAttributes?.address).to.equal(customerBefore.address);
            expect(customerAttributes?.phone).to.equal(customerBefore.phone);
        });

        it('should return a customer by email when a valid email is provided', async () => {
            const customerAttributes = await customerService.getByEmail(customerBefore.email);

            expect(customerAttributes).to.have.property('id');
            expect(customerAttributes?.email).to.equal(customerBefore.email);
            expect(customerAttributes?.password).to.equal(customerBefore.password);
            expect(customerAttributes?.firstName).to.equal(customerBefore.firstName);
            expect(customerAttributes?.lastName).to.equal(customerBefore.lastName);
            expect(customerAttributes?.address).to.equal(customerBefore.address);
            expect(customerAttributes?.phone).to.equal(customerBefore.phone);
        });

        it('should update a customer by ID and return its updated attributes', async () => {
            const customerId = customerBefore.id;
            const resource: PatchCustomerDto = {
                firstName: 'John',
                lastName: 'Doe',
                address: '123 Main St',
                phone: '123-456-7890',
            };

            const customerAttributes = await customerService.patchById(customerId, resource);

            expect(customerAttributes).to.have.property('id');
            expect(customerAttributes?.email).to.equal(customerBefore.email);
            expect(customerAttributes?.password).to.equal(customerBefore.password);
            expect(customerAttributes?.firstName).to.equal(resource.firstName);
            expect(customerAttributes?.lastName).to.equal(resource.lastName);
            expect(customerAttributes?.address).to.equal(resource.address);
            expect(customerAttributes?.phone).to.equal(resource.phone);
        });

        it('should update a customer by ID and return its updated attributes', async () => {
            const customerId = customerBefore.id;
            const resource: PutCustomerDto = {
                email: 'examplePutService@email.com',
                password: 'password',
                firstName: 'John',
                lastName: 'Doe',
                address: '123 Main St',
                phone: '123-456-7890',
            };

            const customerAttributes = await customerService.putById(customerId, resource);

            expect(customerAttributes).to.have.property('id');
            expect(customerAttributes?.email).to.equal(resource.email);
            expect(customerAttributes?.password).to.equal(resource.password);
            expect(customerAttributes?.firstName).to.equal(resource.firstName);
            expect(customerAttributes?.lastName).to.equal(resource.lastName);
            expect(customerAttributes?.address).to.equal(resource.address);
            expect(customerAttributes?.phone).to.equal(resource.phone);
        });

        it('should return false if customer with ID does not exist', async () => {
            const customerId = '123456789';
            const result = await customerService.deleteById(customerId);
            expect(result).to.be.false;
        });

        it('should delete a customer by ID and return true', async () => {
            const customerId = customerBefore.id;
            const result = await customerService.deleteById(customerId);
            expect(result).to.be.true;
        });
    });

    run();
})();
