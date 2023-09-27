import express from 'express';
import { body } from 'express-validator';
import { CommonRoutesConfig } from '../common/common.routes.config';
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';
import jwtMiddleware from '../authorization/middleware/jwt.middleware';
import customerMiddleware from './middleware/customer.middleware';
import customerController from './controllers/customer.controller';
import customerService from './services/customer.service';

export class CustomersRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'CustomersRoutes');
    }

    configureRoutes() {
        this.app
            .route('/customer')
            .get(jwtMiddleware.validateJwt, customerMiddleware.validateCustomerExist, customerController.getById)
            .post(
                body('email').isEmail(),
                body('password').isStrongPassword(),
                body('firstName').isString(),
                body('lastName').isString(),
                body('address').isString(),
                body('phone').isMobilePhone('any'),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                customerMiddleware.validateEmailDoesntExist,
                customerController.create,
            )
            .put(
                body('email').isEmail(),
                body('password').isStrongPassword(),
                body('firstName').isString(),
                body('lastName').isString(),
                body('address').isString(),
                body('phone').isMobilePhone('any'),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                jwtMiddleware.validateJwt,
                customerMiddleware.validateCustomerExist,
                customerMiddleware.validateEmailDoesntExist,
                customerController.putById,
            )
            .patch(
                body('email')
                    .optional()
                    .isEmail()
                    .custom(async (value) => {
                        if (value) {
                            const customer = await customerService.getByEmail(value);
                            if (customer) {
                                throw new Error('E-mail already in use');
                            }
                        }
                        return true;
                    }),
                body('password').optional().isStrongPassword(),
                body('firstName').optional().isString(),
                body('lastName').optional().isString(),
                body('address').optional().isString(),
                body('phone').optional().isMobilePhone('any'),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                jwtMiddleware.validateJwt,
                customerMiddleware.validateCustomerExist,
                customerController.patchById,
            )
            .delete(jwtMiddleware.validateJwt, customerMiddleware.validateCustomerExist, customerController.deleteById);

        return this.app;
    }
}
