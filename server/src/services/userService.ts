import bcrypt from "bcryptjs";
import { User } from "../types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const register = async (data: User) => {
  const { name, email, password, role } = data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: role || "user",
    },
  });
  return user;
};

export const login = async (data: { email: string; password: string }) => {
  const { email, password } = data;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    throw new Error("User not found");
  } else if (!(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid password");
  } else {
    return user;
  }
};

export const resetPassword = async (data: {
  email: string;
  newPassword: string;
}) => {
  const { email, newPassword } = data;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    throw new Error("User not found");
  } else {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword,
      },
    });
    return user;
  }
};

export const updateProfile = async (userId: number, data: Partial<User>) => {
  const updateData = Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== undefined)
  );

  const updateId = prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!updateId) {
    throw new Error("User ID is required to update profile");
  }

  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: updateData,
  });
  return user;
};

export const getProfile = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
  return user;
};
