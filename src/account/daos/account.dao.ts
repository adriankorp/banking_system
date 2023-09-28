import debug from 'debug';
import sequelizeService from '../../common/services/sequelize.service';
import { CreateAccountDto } from '../dtos/create.account.dto';
import Account, { AccountAttributes } from '../models/account.model';
import { PutAccountDto } from '../dtos/put.account.dto';
import { PatchAccountDto } from '../dtos/patch.account.dto';

const log: debug.IDebugger = debug('app:account-dao');

const sequelize = sequelizeService.getSequelize();

class AccountDao {
    private Account = Account;

    constructor() {
        log('Created new instance of AccountDao');
    }

    async add(accountFields: CreateAccountDto): Promise<AccountAttributes> {
        const account = await this.Account.create(accountFields);
        return account;
    }

    async getById(accountId: string): Promise<AccountAttributes | null> {
        return this.Account.findOne({
            where: { id: accountId },
        });
    }

    async getByAccountNumber(accountNumber: string): Promise<AccountAttributes | null> {
        return this.Account.findOne({
            where: { accountNumber },
        });
    }

    async getByCustomerId(customerId: string): Promise<AccountAttributes | null> {
        return this.Account.findOne({
            where: { customerId },
        });
    }

    async updateByCustomerId(customerId: string, accountFields: PatchAccountDto): Promise<AccountAttributes | null> {
        const account = await this.Account.update(accountFields, {
            where: { customerId },
        });

        if (!account[0]) {
            return null;
        }

        const updatedAccount = await this.getById(customerId);

        return updatedAccount;
    }
}

export default new AccountDao();
