import { Router } from "express";
import { getUsers } from "../controllers/adminController";
import { authorizeAdmin } from "../middleware/auth";

const router = Router();

router.get("/users", authorizeAdmin, getUsers);

export default router;
