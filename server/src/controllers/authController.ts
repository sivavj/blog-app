import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  getProfile,
  login,
  register,
  resetPassword,
  updateProfile,
} from "../services/userService";
import { generateToken } from "../utils/jwtUtils";
import { User } from "../types";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const user = await register(req.body);
    const token = generateToken({ id: user.id, role: user.role });
    res.status(201).json({
      message: "User registered successfully",
      token,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const user = await login(req.body);
    const token = generateToken({ id: user.id, role: user.role });
    res.status(200).json({
      message: "User logged in successfully",
      token,
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const resetUserPassword = async (req: Request, res: Response) => {
  try {
    await resetPassword(req.body);
    res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await updateProfile(Number(userId), req.body);
    res.status(200).json({
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      role: string;
    };
    const user = await getProfile(Number(decoded.id));
    res.status(200).json({
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
