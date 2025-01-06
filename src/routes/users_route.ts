import express from "express";
const router = express.Router();
import usersController from "../controllers/users_controller";

router.post("/", usersController.createUser.bind(usersController));
router.put("/:id", usersController.updateUser.bind(usersController));
router.delete("/:id", usersController.deleteUser.bind(usersController));

export default router;