import debug from 'debug';
import sequelizeService from '../../common/services/sequelize.service';
import { CreateCustomerDto } from '../dtos/create.customer.dto';
import Customer, { CustomerAttributes } from '../models/customer.model';
import { PutCustomerDto } from '../dtos/put.customer.dto';
import { PatchCustomerDto } from '../dtos/patch.customer.dto';

const log: debug.IDebugger = debug('app:customer-dao');

const sequelize = sequelizeService.getSequelize();

class CustomerDao {
    private Customer = Customer;

    constructor() {
        log('Created new instance of CustomerDao');
    }

    async add(customerFields: CreateCustomerDto): Promise<CustomerAttributes> {
        const customer = await this.Customer.create(customerFields);
        return customer;
    }

    async getById(customerId: string): Promise<CustomerAttributes | null> {
        return this.Customer.findOne({
            where: { id: customerId },
        });
    }

    async getByEmail(email: string): Promise<CustomerAttributes | null> {
        return this.Customer.findOne({
            where: { email },
        });
    }

    async getAll(limit = 25, page = 0): Promise<CustomerAttributes[]> {
        const offset = page * limit;
        return this.Customer.findAll({
            limit,
            offset,
        });
    }

    async updateById(
        customerId: string,
        customerFields: PutCustomerDto | PatchCustomerDto,
    ): Promise<CustomerAttributes | null> {
        const customer = await this.Customer.update(customerFields, {
            where: { id: customerId },
        });

        if (!customer[0]) {
            return null;
        }

        const updatedCustomer = await this.getById(customerId);

        return updatedCustomer;
    }
    async deleteById(customerId: string): Promise<boolean> {
        const customer = await this.Customer.destroy({
            where: { id: customerId },
        });
        return customer > 0;
    }

    async deleteByEmail(email: string): Promise<boolean> {
        const customer = await this.Customer.destroy({
            where: { email },
        });
        return customer > 0;
    }
}

export default new CustomerDao();
