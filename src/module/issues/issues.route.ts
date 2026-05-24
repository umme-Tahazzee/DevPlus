import {
  Router,
 
} from "express";
import { issuesController } from "./issues.controller.js";
import auth from "../../middleware/auth.js";


const router = Router();
router.post("/", auth, issuesController.createIssues);
router.get("/", issuesController.getAllIssue);
router.get("/:id", issuesController.getSingleIssue);
router.patch("/:id",auth, issuesController.updateIssues);
router.delete("/:id", auth , issuesController.deleteIssues);





export const issueRoute = router;
