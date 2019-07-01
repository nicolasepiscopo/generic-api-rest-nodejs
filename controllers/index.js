import express from "express"
import userRoutes from "./user"

const router = express.Router()
const prefix = "api"

router.use(`/${prefix}/users`, userRoutes)

export default router
