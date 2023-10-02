/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import customerDao from '../../../src/customer/daos/customer.dao';
import { PutCustomerDto } from '../../../src/customer/dtos/put.customer.dto';
import { PatchCustomerDto } from '../../../src/customer/dtos/patch.customer.dto';
import { CustomerAttributes } from '../../../src/customer/models/customer.model';
import { CreateCustomerDto } from '../../../src/customer/dtos/create.customer.dto';
import { delay } from '../../../src/common/utils/utils';

(async function () {
    await delay(3);

    describe('CustomerDao', () => {
        let customerBefore: CustomerAttributes;

        before(async () => {
            // Create a customer that we will use for testing
            const createCustomerDto: CreateCustomerDto = {
                email: 'before@example.com',
                password: 'password',
                firstName: 'John',
                lastName: 'Doe',
                address: '123 Main St',
                phone: '123-456-7890',
            };
            customerBefore = await customerDao.add(createCustomerDto);
        });
        // Add a new customer successfully
        it('should add a new customer successfully when all fields are provided', async () => {
            const createCustomerDto: CreateCustomerDto = {
                email: 'test@example.com',
                password: 'password',
                firstName: 'John',
                lastName: 'Doe',
                address: '123 Main St',
                phone: '123-456-7890',
            };

            const result = await customerDao.add(createCustomerDto);

            expect(result).to.be.an('object');
            expect(result.email).to.equal(createCustomerDto.email);
            expect(result.password).to.equal(createCustomerDto.password);
            expect(result.firstName).to.equal(createCustomerDto.firstName);
            expect(result.lastName).to.equal(createCustomerDto.lastName);
            expect(result.address).to.equal(createCustomerDto.address);
            expect(result.phone).to.equal(createCustomerDto.phone);
        });

        // Get a customer by ID successfully
        it('should get a customer by ID successfully when a valid ID is provided', async () => {
            const customerId = customerBefore.id;

            const result = await customerDao.getById(customerId);

            expect(result).to.be.an('object');
            expect(result?.id).to.equal(customerId);
        });

        // Get a customer by email successfully
        it('should get a customer by email successfully when a valid email is provided', async () => {
            const { email } = customerBefore;

            const result = await customerDao.getByEmail(email);

            expect(result).to.be.an('object');
            expect(result?.email).to.equal(email);
        });

        // Add a customer with missing fields
        it('should throw an error when adding a customer with missing fields', async () => {
            const customerFields: CreateCustomerDto = {
                email: 'test2@example.com',
                password: 'password123',
                firstName: 'John',
                lastName: 'Doe',
                address: '', // Missing field
                phone: '123-456-7890',
            };

            try {
                await customerDao.add(customerFields);
                // Fail the test if no error is thrown
                expect.fail('Expected an error to be thrown');
            } catch (error: any) {
                expect(error).to.be.an('error');
                expect(error.message).to.equal('Validation error: Validation len on address failed');
            }
        });

        // Add a customer with invalid email
        it('should throw an error when adding a customer with an invalid email', async () => {
            const customerFields: CreateCustomerDto = {
                email: 'invalidEmail', // Invalid email format
                password: 'password123',
                firstName: 'John',
                lastName: 'Doe',
                address: '123 Main St',
                phone: '123-456-7890',
            };

            try {
                await customerDao.add(customerFields);
                // Fail the test if no error is thrown
                expect.fail('Expected an error to be thrown');
            } catch (error: any) {
                expect(error).to.be.an('error');
                expect(error.message).to.equal('Validation error: Validation isEmail on email failed');
            }
        });
        // Add a customer with duplicate email
        it('should throw an error when adding a customer with a duplicate email', async () => {
            const customerFields1: CreateCustomerDto = {
                email: 'duplicate@example.com',
                password: 'password123',
                firstName: 'John',
                lastName: 'Doe',
                address: '123 Main St',
                phone: '123-456-7890',
            };
            const customerFields2: CreateCustomerDto = {
                email: 'duplicate@example.com', // Duplicate email
                password: 'password456',
                firstName: 'Jane',
                lastName: 'Smith',
                address: '456 Elm St',
                phone: '987-654-3210',
            };

            await customerDao.add(customerFields1);

            try {
                await customerDao.add(customerFields2);
                // Fail the test if no error is thrown
                expect.fail('Expected an error to be thrown');
            } catch (error: any) {
                expect(error).to.be.an('error');
                expect(error.message).to.equal('Validation error');
                expect(error.errors[0].message).to.equal('email must be unique');
            }
        });

        // Get a non-existent customer by ID
        it('should return null when getting a non-existent customer by ID', async () => {
            const customerId = 'non-existent-id';

            const result = await customerDao.getById(customerId);

            expect(result).to.be.null;
        });

        // Get a non-existent customer by email
        it('should return null when getting a non-existent customer by email', async () => {
            const email = 'nonexistent@example.com';

            const result = await customerDao.getByEmail(email);

            expect(result).to.be.null;
        });

        // Get all customers with limit and page parameters
        it('should get all customers with limit and page parameters', async () => {
            const limit = 10;
            const page = 1;

            const result = await customerDao.getAll(limit, page);

            expect(result).to.be.an('array');
            expect(result.length).to.lessThan(limit + 1);
        });

        // Delete a non-existent customer by ID
        it('should return false when deleting a non-existent customer by ID', async () => {
            const customerId = 'non-existent-id';

            const result = await customerDao.deleteById(customerId);

            expect(result).to.be.false;
        });

        // Update a non-existent customer by ID
        it('should return null when updating a non-existent customer by ID', async () => {
            const customerId = 'non-existent-id';
            const customerFields: PutCustomerDto = {
                email: 'test@example.com',
                password: 'password123',
                firstName: 'John',
                lastName: 'Doe',
                address: '123 Main St',
                phone: '123-456-7890',
            };

            const result = await customerDao.updateById(customerId, customerFields);

            expect(result).to.be.null;
        });

        // Delete a non-existent customer by email
        it('should return false when deleting a non-existent customer by email', async () => {
            const email = 'nonexistent@example.com';

            const result = await customerDao.deleteByEmail(email);

            expect(result).to.be.false;
        });
        // Get all customers successfully
        it('should get all customers successfully', async () => {
            const limit = 25;
            const page = 0;

            const result = await customerDao.getAll(limit, page);

            expect(result).to.be.an('array');
            expect(result.length).to.be.at.most(limit);
        });

        // Delete a customer by ID successfully
        it('should delete a customer by ID successfully', async () => {
            const customerFields: CreateCustomerDto = {
                email: 'delete@example.com',
                password: 'password123',
                firstName: 'John',
                lastName: 'Doe',
                address: '123 Main St',
                phone: '123-456-7890',
            };

            const addedCustomer = await customerDao.add(customerFields);
            const customerId = addedCustomer.id;

            const result = await customerDao.deleteById(customerId);

            expect(result).to.be.true;
        });
        // Delete a customer by email successfully
        it('should delete a customer by email successfully', async () => {
            const customerFields: CreateCustomerDto = {
                email: 'delete2@example.com',
                password: 'password123',
                firstName: 'John',
                lastName: 'Doe',
                address: '123 Main St',
                phone: '123-456-7890',
            };

            // Add the customer
            await customerDao.add(customerFields);

            // Delete the customer by email
            const result = await customerDao.deleteByEmail(customerFields.email);

            expect(result).to.be.true;
        });

        // Update a customer by ID successfully
        it('should update a customer by ID successfully when all fields are provided', async () => {
            const customerId = customerBefore.id;
            const customerFields: PutCustomerDto = {
                email: 'before2@example.com',
                password: 'newpassword123',
                firstName: 'John',
                lastName: 'Doe',
                address: '456 Main St',
                phone: '987-654-3210',
            };

            const result = await customerDao.updateById(customerId, customerFields);

            expect(result).to.be.an('object');
            expect(result?.email).to.equal(customerFields.email);
            expect(result?.password).to.equal(customerFields.password);
            expect(result?.firstName).to.equal(customerFields.firstName);
            expect(result?.lastName).to.equal(customerFields.lastName);
            expect(result?.address).to.equal(customerFields.address);
            expect(result?.phone).to.equal(customerFields.phone);
        });
    });

    run();
})();
