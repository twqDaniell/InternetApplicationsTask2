import express from "express";
const router = express.Router();
import postsController from "../controllers/posts_controller";

router.post("/", postsController.createPost.bind(postsController));
router.get("/:id", postsController.getPostById.bind(postsController));
router.get("/", postsController.getAllPosts.bind(postsController));
router.put("/:id", postsController.updatePost.bind(postsController))

export default router;