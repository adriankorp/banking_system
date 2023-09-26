import { Request, Response, NextFunction } from 'express';
import { STATUS, MESSAGE } from '../constants/response.constants';
import { validationResult } from 'express-validator';

class BodyValidationMiddleware {
	verifyBodyFieldsErrors(req: Request, res: Response, next: NextFunction) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(STATUS.BAD_REQUEST)
				.send({ errors: [MESSAGE.BAD_REQUEST] });
		}
		next();
	}
}

export default new BodyValidationMiddleware();