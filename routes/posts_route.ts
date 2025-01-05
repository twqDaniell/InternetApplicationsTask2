import express from "express";
const router = express.Router();
import postsController from "../controllers/posts_controller";

router.post("/", postsController.createPost);
router.get("/:id", postsController.getPostById);
router.get("/", postsController.getAllPosts);
router.put("/:id", postsController.updatePost)

export default router;