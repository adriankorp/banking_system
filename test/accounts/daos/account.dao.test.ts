import { expect } from 'chai';
import { delay } from '../../../src/common/utils/utils';
import { CustomerAttributes } from '../../../src/customer/models/customer.model';
import customerService from '../../../src/customer/services/customer.service';
import { AccountAttributes } from '../../../src/account/models/account.model';
import accountDao from '../../../src/account/daos/account.dao';

(async function () {
    await delay(3);

    describe('AccountDAO', () => {
        let beforeCustomer: CustomerAttributes;
        let account: AccountAttributes;
        before(async () => {
            beforeCustomer = await customerService.create({
                email: 'accountDao@email.com',
                firstName: 'Account',
                lastName: 'Dao',
                password: 'accountDao',
                address: 'Account Dao Address',
                phone: '1234567890',
            });
        });

        it('should create a new account', async () => {
            account = await accountDao.add({
                customerId: beforeCustomer.id,
            });

            expect(account).to.have.property('id');
            expect(account).to.have.property('accountNumber');
            expect(account).to.have.property('balance');
            expect(account).to.have.property('customerId');
        });

        it('should get account by id', async () => {
            const foundAccount = await accountDao.getById(account.id);

            expect(foundAccount).to.have.property('id');
            expect(foundAccount).to.have.property('accountNumber');
            expect(foundAccount).to.have.property('balance');
            expect(foundAccount).to.have.property('customerId');
        });

        it('should get account by account number', async () => {
            const foundAccount = await accountDao.getByAccountNumber(account.accountNumber);

            expect(foundAccount).to.have.property('id');
            expect(foundAccount).to.have.property('accountNumber');
            expect(foundAccount).to.have.property('balance');
            expect(foundAccount).to.have.property('customerId');
        });

        it('should get account by customer id', async () => {
            const foundAccount = await accountDao.getByCustomerId(account.customerId);

            expect(foundAccount).to.have.property('id');
            expect(foundAccount).to.have.property('accountNumber');
            expect(foundAccount).to.have.property('balance');
            expect(foundAccount).to.have.property('customerId');
        });

        it('should update account by customer id', async () => {
            const updatedAccount = await accountDao.updateByCustomerId(account.customerId, {
                balance: 100,
            });

            expect(updatedAccount).to.have.property('id');
            expect(updatedAccount).to.have.property('accountNumber');
            expect(updatedAccount).to.have.property('balance');
            expect(updatedAccount).to.have.property('customerId');
            expect(updatedAccount?.balance).to.equal(100);
        });
    });

    run();
})();
