import debug from 'debug';
import accountDao from '../daos/account.dao';
import { AccountAttributes } from '../models/account.model';
import { PatchAccountDto } from '../dtos/patch.account.dto';
import { PutAccountDto } from '../dtos/put.account.dto';
import { CreateAccountDto } from '../dtos/create.account.dto';

const log: debug.IDebugger = debug('app:account-service');

class AccountService {
    constructor() {
        log('Created new instance of AccountService');
    }

    async create(resource: CreateAccountDto): Promise<AccountAttributes> {
        return accountDao.add(resource);
    }

    async readByAccountNumber(accountNumber: string): Promise<AccountAttributes | null> {
        return accountDao.getByAccountNumber(accountNumber);
    }

    async patchByCustomerId(customerId: string, resource: PatchAccountDto): Promise<AccountAttributes | null> {
        return accountDao.updateByCustomerId(customerId, resource);
    }

    async readByCustomerId(customerId: string): Promise<AccountAttributes | null> {
        return accountDao.getByCustomerId(customerId);
    }
}

export default new AccountService();
