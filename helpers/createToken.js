import jwt from "jwt-simple"
import moment from "moment"
import { AUTH_TOKEN_SECRET, AUTH_TOKEN_EXPIRATION_DAYS } from "../configuration"

export default user => {
	var payload = {
		userId: user._id,
		creationDate: moment().unix(),
		expirationDate: moment().add(AUTH_TOKEN_EXPIRATION_DAYS, "days").unix(),
	}

	return jwt.encode(payload, AUTH_TOKEN_SECRET)
}
