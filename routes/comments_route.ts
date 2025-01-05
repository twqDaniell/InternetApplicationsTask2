import express from "express";
const router = express.Router();
import commentsController from "../controllers/comments_controller";

router.post("/", commentsController.createComment);
router.get("/", commentsController.getAllComments);
router.get("/:id", commentsController.getCommentById);
router.put("/:id", commentsController.updateComment);
router.delete("/:id", commentsController.deleteComment);

export default router;