import express from "express";
const router = express.Router();
import commentsController from "../controllers/comments_controller";

router.post("/", commentsController.createComment.bind(commentsController));
router.get("/", commentsController.getAllComments.bind(commentsController));
router.get("/:id", commentsController.getCommentById.bind(commentsController));
router.put("/:id", commentsController.updateComment.bind(commentsController));
router.delete("/:id", commentsController.deleteComment.bind(commentsController));

export default router;