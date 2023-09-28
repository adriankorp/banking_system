import debug from 'debug';
import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';

import { STATUS } from '../../common/constants/response.constants';
import customerService from '../services/customer.service';

const log: debug.IDebugger = debug('app:customer-controller');

class CustomerController {
    constructor() {
        log('Created new instance of CustomerController');
    }

    async create(req: Request, res: Response, next: NextFunction) {
        const { email, firstName, lastName, address, phone, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const customer = await customerService.create({
            email,
            firstName,
            lastName,
            address,
            phone,
            password: hashedPassword,
        });
        res.status(STATUS.CREATED).send({
            message: 'Customer created',
        });
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        const customer = await customerService.readById(res.locals.jwt.id);

        res.status(STATUS.OK).send({
            firstName: customer?.firstName,
            lastName: customer?.lastName,
            email: customer?.email,
            address: customer?.address,
            phone: customer?.phone,
        });
    }

    async putById(req: Request, res: Response, next: NextFunction) {
        const { email, firstName, lastName, address, phone, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const customer = await customerService.putById(res.locals.jwt.id, {
            email,
            firstName,
            lastName,
            address,
            phone,
            password: hashedPassword,
        });

        res.status(STATUS.OK).send({
            message: 'Customer updated',
        });
    }

    async patchById(req: Request, res: Response, next: NextFunction) {
        const { email, firstName, lastName, address, phone, password } = req.body;
        let hashedPassword;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        const customer = await customerService.patchById(res.locals.jwt.id, {
            email,
            firstName,
            lastName,
            address,
            phone,
            password: hashedPassword,
        });
        res.status(STATUS.OK).send({
            message: 'Customer updated',
        });
    }

    async deleteById(req: Request, res: Response, next: NextFunction) {
        const customer = await customerService.deleteById(res.locals.jwt.id);
        res.status(STATUS.OK).send({
            message: 'Customer deleted',
        });
    }
}

export default new CustomerController();
