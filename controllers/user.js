import express from "express"
import runValidation from "../helpers/runValidation"
import User from "../models/user"
import userValidator from "../validators/user"
import { isAuthenticated } from "../middlewares/authentication"
import createToken from "../helpers/createToken"

const router = express.Router()

router.get("/", isAuthenticated, (req, res) => {
	User.find({}, (err, users) => {
		return res.json({
			user: req.user,
			users
		})
	})
})

router.post("/register", userValidator.onRegister, (req, res, next) => {
	runValidation(req, res, next)

	const {body: {email, password}} = req

	User.findOne({email}).then(existingUser => {
		if (existingUser)
			res.status(400).json({
				message: "Email already in use"
			})
		else {
			User.create({
				email, password
			})
				.then(user => {
					const token = createToken(user)

					user.authToken = token
					user.save()

					return res.json({
						email,
						authToken: token
					})
				})
				.catch(next)
		}
	})
})

router.post("/authenticate", userValidator.onAuthenticate, (req, res, next) => {
	runValidation(req, res, next)
	const {body: {email, password}} = req

	User.authenticate(email, password)
		.then(user => {
			const token = createToken(user)

			user.authToken = token
			user.save()

			return res.json({
				email,
				authToken: req.session.userToken
			})
		})
		.catch(next)
})

router.post("/logout", isAuthenticated, (req, res) => {
	const {user} = req

	user.authToken = ""
	user.save()

	return res.json({})
})

export default router
