import { validationResult } from "express-validator/check"

export default (req, res, next) => {
	const errors = validationResult(req)

	if (!errors.isEmpty()) {
		const err = new Error(JSON.stringify({errors: errors.array()}))
		err.status = 400
		next(err)
	}
}
