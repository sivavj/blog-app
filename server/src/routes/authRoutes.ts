import { Router } from "express";
import {
  getUserProfile,
  loginUser,
  registerUser,
  resetUserPassword,
  updateUserProfile,
} from "../controllers/authController";
import { autenticate } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/reset-password", resetUserPassword);
router.put("/user/:userId", autenticate, updateUserProfile);
router.get("/me", autenticate, getUserProfile);

export default router;

