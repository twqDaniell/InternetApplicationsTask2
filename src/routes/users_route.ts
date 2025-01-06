import express from "express";
const router = express.Router();
import usersController from "../controllers/users_controller";

router.post("/", usersController.createUser.bind(usersController));

export default router;