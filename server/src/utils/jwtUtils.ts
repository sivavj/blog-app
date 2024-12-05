import jwt from "jsonwebtoken";

export const generateToken = (user: { id: number; role: string }): string => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1h",
    }
  );
};

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      role: string;
    };
    return decoded;
  } catch (error) {
    return null;
  }
};
