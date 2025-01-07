import express from "express";
const router = express.Router();
import authController from "../controllers/auth_controller";

router.post("/", authController.register.bind(authController));

export default router;