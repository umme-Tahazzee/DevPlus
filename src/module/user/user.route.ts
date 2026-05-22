import { Router, type Request } from "express";
import { userController } from "./user.controller.js";

const router = Router()
router.post('/', userController.createUser)


export const userRoute = router;