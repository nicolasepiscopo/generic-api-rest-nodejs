import { check } from "express-validator/check"

const onRegister = [
	check("email").trim().isLength({ min: 1 }).withMessage("Email is required").isEmail().withMessage("Email is not valid"),
	check("password").isLength({ min: 6 }).withMessage("Password is not valid"),
	check("password_confirmation").isLength({ min: 6 }).withMessage("Confirmation password is not valid")
		.custom((value, {req}) => {
			const {body: {password}} = req

			if (value !== password)
				throw new Error("Passwords don't match")

			return true
		})
]

const onAuthenticate = [
	check("email").trim().isLength({ min: 1}).withMessage("Email is required").isEmail().withMessage("Email is not valid"),
	check("password").isLength({ min: 6 }).withMessage("Password is not valid")
]

export default {
	onRegister,
	onAuthenticate,
}
