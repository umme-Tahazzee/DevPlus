import {
  Router,
 
} from "express";
import { issuesController } from "./issues.controller.js";
import auth from "../../middleware/auth.js";


const router = Router();
router.post("/", auth, issuesController.createIssues);
router.get("/", issuesController.getAllIssue);


export const issueRoute = router;
