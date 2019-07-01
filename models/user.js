import mongoose from "mongoose"
import bcrypt from "bcrypt"

const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
		required: true,
		trim: true
	},
	password: {
		type: String,
		required: true,
	},
	authToken: {
		type: String,
		required: false
	}
})

UserSchema.statics.authenticate = (email, password) => {
	const error = new Error("Bad credentials")
	error.status = 401

	return User.findOne({ email: email })
		.then(user => {
			if (!user)
				throw error

			if (bcrypt.compareSync(password, user.password))
				return user

			throw error
		})
}

UserSchema.pre("save", function (next) {
	const user = this

	if (!this.isModified("password")) next()

	bcrypt.hash(user.password, 10)
		.then(hash => {
			user.password = hash
			next()
		})
		.catch(next)
})

const User = mongoose.model("users", UserSchema)

export default User
