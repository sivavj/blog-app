import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface AuthenticateRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

export const autenticate = async (
  req: AuthenticateRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      role: string;
    };
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    req.user = { id: user?.id, role: user?.role };
    next();
  } catch (error: any) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const authorize = (roles: string[]) => {
  return (
    req: AuthenticateRequest,
    res: Response,
    next: NextFunction
  ): any => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(401)
        .json({ message: "Forbidden: Inssuficient permissions" });
    }
    next();
  };
};
