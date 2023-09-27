import debug from 'debug';
import customerDao from '../daos/customer.dao';
import { CustomerAttributes } from '../models/customer.model';
import { PatchCustomerDto } from '../dtos/patch.customer.dto';
import { PutCustomerDto } from '../dtos/put.customer.dto';
import { CreateCustomerDto } from '../dtos/create.customer.dto';
import { CRUD } from '../../common/interfaces/crud.interface';

const log: debug.IDebugger = debug('app:cumstomer-service');

class CustomerService implements CRUD {
    constructor() {
        log('Created new instance of CustomerService');
    }

    async create(resource: CreateCustomerDto): Promise<CustomerAttributes> {
        return customerDao.add(resource);
    }

    async deleteById(id: string): Promise<boolean> {
        return customerDao.deleteById(id);
    }

    async list(limit: number, page: number): Promise<CustomerAttributes[]> {
        return customerDao.getAll(limit, page);
    }

    async patchById(id: string, resource: PatchCustomerDto): Promise<CustomerAttributes | null> {
        return customerDao.updateById(id, resource);
    }

    async readById(id: string): Promise<CustomerAttributes | null> {
        return customerDao.getById(id);
    }

    async putById(id: string, resource: PutCustomerDto): Promise<CustomerAttributes | null> {
        return customerDao.updateById(id, resource);
    }

    async getByEmail(email: string): Promise<CustomerAttributes | null> {
        return customerDao.getByEmail(email);
    }
}

export default new CustomerService();
