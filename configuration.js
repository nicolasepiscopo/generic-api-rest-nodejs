const MONGO_USER = "user"
const MONGO_PASSWORD = "password"
const MONGO_HOST = "cluster0-j2sgt.gcp.mongodb.net"
const dev = process.env.NODE_ENV !== "production"
const databaseName = dev ? "test" : "production"

export const MONGO_URL = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}/${databaseName}?retryWrites=true&w=majority`
export const APP_SECRET = "secret one"
export const AUTH_TOKEN_SECRET = "secret two"
export const AUTH_TOKEN_EXPIRATION_DAYS = 15

export default {
	MONGO_URL,
	APP_SECRET,
	AUTH_TOKEN_SECRET,
	AUTH_TOKEN_EXPIRATION_DAYS
}
