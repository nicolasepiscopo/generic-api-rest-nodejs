import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import session from "express-session"
import connect from "connect-mongo"
import expressValidator from "express-validator"
import bearerToken from "express-bearer-token"
import { MONGO_URL, APP_SECRET } from "./configuration"
import controllers from "./controllers"

const app = express()
const MongoStore = connect(session)
mongoose.connect(MONGO_URL, {useNewUrlParser: true})
const db = mongoose.connection

// eslint-disable-next-line no-console
db.on("error", console.error.bind(console, "connection error:"))
// eslint-disable-next-line no-console
db.once("open", console.log.bind(console, "connection success"))

//use sessions for tracking logins
app.use(session({
	secret: APP_SECRET,
	resave: true,
	saveUninitialized: false,
	store: new MongoStore({
		mongooseConnection: db
	})
}))

app.set("json spaces", 40)

// parse incoming requests
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((req, res, next) => {
	res.header("Content-Type", "application/json")
	next()
})

app.use(bearerToken({
	cookie: {
		signed: true,
		secret: APP_SECRET,
		key: "access_token"
	}
}))

app.use(express.static(__dirname + "/public"))

app.use(expressValidator())

app.use(controllers)

// catch 404
app.get("*", function (req, res) {
	res.status(404)
	res.send("Page not found")
})
// error handler
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
	res.status(err.status || 500)
	res.send(err.message)
})

// eslint-disable-next-line no-console
app.listen(3000, () => console.log("Listening on port 3000..."))
