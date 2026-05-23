import { Router } from "express";
import { authRoute } from "../module/auth/auth.route.js";
import { userRoute } from "../module/user/user.route.js";
import { issueRoute } from "../module/issues/issues.route.js";

const router = Router();

router.use("/auth", authRoute);
router.use("/users", userRoute);
router.use("/issues", issueRoute);

export default router;