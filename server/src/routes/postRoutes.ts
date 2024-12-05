import { Router } from "express";
import {
  createPostController,
  deletePostController,
  getPostByIdController,
  getPostsController,
  updatePostController,
} from "../controllers/postController";
import { autenticate, authorize } from "../middlewares/authMiddleware";
import upload from "../utils/fileUtils";

const router = Router();

// public routes
router.get("/", getPostsController);
router.get("/:postId", getPostByIdController);

// protected routes
router.post(
  "/",
  autenticate,
  authorize(["admin"]),
  upload.single("image"),
  createPostController
);
router.put("/:postId", autenticate, authorize(["admin"]), updatePostController);
router.delete(
  "/:postId",
  autenticate,
  authorize(["admin"]),
  upload.single("image"),
  deletePostController
);

export default router;
