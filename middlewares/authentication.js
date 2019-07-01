import jwt from "jwt-simple"
import moment from "moment"
import { AUTH_TOKEN_SECRET } from "../configuration"
import User from "../models/user"

export const isAuthenticated = (req, res, next) => {
	if (!req.headers.authorization) {
		const error = new Error("Authentication header not present")
		error.status = 403

		next(error)
	}

	const bearerTokenSplitted = req.headers.authorization.split(" ")
	const token = bearerTokenSplitted.length === 2 ? bearerTokenSplitted[1] : null

	if (token) {
		const payload = jwt.decode(token, AUTH_TOKEN_SECRET)

		if(payload.expirationDate <= moment().unix()) {
			const error = new Error("Authentication token expired")
			error.status = 401

			next(error)
		}

		User.findOne({
			_id: payload.userId,
			authToken: token
		}).then(user => {
			if (!user) throw "Not found"

			req.user = user
			next()
		}).catch(() => {
			const error = new Error("Authentication token is not valid")
			error.status = 401

			next(error)
		})
	} else {
		const error = new Error("Authentication token is not valid")
		error.status = 403

		next(error)
	}
}
