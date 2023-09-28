import debug from 'debug';
import accountDao from '../daos/account.dao';
import { AccountAttributes } from '../models/account.model';
import { PatchAccountDto } from '../dtos/patch.account.dto';
import { PutAccountDto } from '../dtos/put.account.dto';
import { CreateAccountDto } from '../dtos/create.account.dto';
import { CRUD } from '../../common/interfaces/crud.interface';

const log: debug.IDebugger = debug('app:account-service');

class AccountService implements CRUD {
    constructor() {
        log('Created new instance of AccountService');
    }

    async create(resource: CreateAccountDto): Promise<AccountAttributes> {
        return accountDao.add(resource);
    }

    async deleteById(id: string): Promise<boolean> {
        return accountDao.deleteById(id);
    }

    async list(limit: number, page: number): Promise<AccountAttributes[]> {
        return accountDao.getAll(limit, page);
    }

    async patchById(id: string, resource: PatchAccountDto): Promise<AccountAttributes | null> {
        return accountDao.updateById(id, resource);
    }

    async readById(id: string): Promise<AccountAttributes | null> {
        return accountDao.getById(id);
    }

    async putById(id: string, resource: PutAccountDto): Promise<AccountAttributes | null> {
        return accountDao.updateById(id, resource);
    }

    async patchByCustomerId(customerId: string, resource: PatchAccountDto): Promise<AccountAttributes | null> {
        return accountDao.updateByCustomerId(customerId, resource);
    }

    async readByCustomerId(customerId: string): Promise<AccountAttributes | null> {
        return accountDao.getByCustomerId(customerId);
    }
}

export default new AccountService();
