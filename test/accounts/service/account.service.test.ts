import { expect } from 'chai';

import { delay } from '../../../src/common/utils/utils';
import { CustomerAttributes } from '../../../src/customer/models/customer.model';
import { AccountAttributes } from '../../../src/account/models/account.model';
import customerService from '../../../src/customer/services/customer.service';
import accountService from '../../../src/account/services/account.service';

(async function () {
    delay(3);

    describe('AccountService', () => {
        let beforeCustomer: CustomerAttributes;
        let account: AccountAttributes;

        before(async () => {
            beforeCustomer = await customerService.create({
                email: 'accountService@gmail.com',
                password: 'password',
                firstName: 'account',
                lastName: 'service',
                address: 'address',
                phone: 'phone',
            });
        });

        it('should create a new account', async () => {
            account = await accountService.create({
                customerId: beforeCustomer.id,
            });
            expect(account).to.have.property('id');
            expect(account).to.have.property('accountNumber');
            expect(account).to.have.property('balance');
            expect(account).to.have.property('customerId');
        });

        it('should read an account', async () => {
            const readAccount = await accountService.readByAccountNumber(account.accountNumber);
            expect(readAccount).to.have.property('id');
            expect(readAccount).to.have.property('accountNumber');
            expect(readAccount).to.have.property('balance');
            expect(readAccount).to.have.property('customerId');
        });

        it('should read an account by customerId', async () => {
            const readAccount = await accountService.readByCustomerId(account.customerId);
            expect(readAccount).to.have.property('id');
            expect(readAccount).to.have.property('accountNumber');
            expect(readAccount).to.have.property('balance');
            expect(readAccount).to.have.property('customerId');
        });

        it('should patch an account', async () => {
            const patchAccount = await accountService.patchByCustomerId(account.customerId, {
                balance: 100,
            });
            expect(patchAccount).to.have.property('id');
            expect(patchAccount).to.have.property('accountNumber');
            expect(patchAccount).to.have.property('balance');
            expect(patchAccount).to.have.property('customerId');
            expect(patchAccount?.balance).to.equal(100);
        });
    });

    run();
})();
