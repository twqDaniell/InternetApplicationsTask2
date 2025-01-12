import express from "express";
const router = express.Router();
import postsController from "../controllers/posts_controller";
import { authMiddleware } from "../controllers/auth_controller";

router.post("/", authMiddleware, postsController.createPost.bind(postsController));
router.get("/:id", postsController.getPostById.bind(postsController));
router.get("/", postsController.getAllPosts.bind(postsController));
router.put("/:id", authMiddleware, postsController.updatePost.bind(postsController))
router.delete("/:id", authMiddleware, postsController.deletePost.bind(postsController))

export default router;