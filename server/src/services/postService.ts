import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createPost = async (
  data: Omit<Prisma.PostCreateInput, "author" | "comments" | "image"> & {
    authorId: number;
  },
  imagePath: string
) => {
  const { authorId, ...postData } = data;
  const post = await prisma.post.create({
    data: {
      ...postData,
      image: imagePath,
      author: {
        connect: {
          id: Number(authorId),
        },
      },
    },
  });
  return post;
};

interface GetPostParams {
  page?: number;
  limit?: number;
  search?: string;
  tags?: string[];
  autherId?: number;
}

export const getPosts = async (params: GetPostParams) => {
  const { page = 1, limit = 10, search, tags, autherId } = params;

  const skip = (page - 1) * limit;
  const take = limit;

  const where: any = {
    AND: [
      search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { content: { contains: search, mode: "insensitive" } },
            ],
          }
        : undefined,
      tags?.length
        ? {
            tags: {
              hasSome: tags,
            },
          }
        : undefined,
      autherId ? { autherId } : undefined,
    ].filter(Boolean),
  };

  const post = await prisma.post.findMany({
    where,
    include: {
      author: true,
      comments: true,
    },
    skip,
    take,
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalPosts = await prisma.post.count({
    where,
  });

  return {
    data: post,
    page,
    limit,
    total: Math.ceil(totalPosts / limit),
  };
};

export const getPostById = async (postId: number) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      author: true,
      comments: true,
    },
  });
  return post;
};

export const updatePost = async (
  postId: number,
  data: Omit<Prisma.PostCreateInput, "author" | "comments" | "image"> & {
    authorId?: number;
  },
  imagePath?: string
) => {
  const { authorId, ...postData } = data;

  const existingPost = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!existingPost) {
    throw new Error("Post not found");
  }

  const updatePost = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      ...postData,
      ...(imagePath && { image: imagePath }),
      ...(authorId && {
        author: {
          connect: {
            id: authorId,
          },
        },
      }),
    },
  });

  return updatePost;
};

export const deletePost = async (postId: number) => {
  const existingPost = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!existingPost) {
    throw new Error("Post not found");
  }

  return await prisma.post.delete({
    where: {
      id: postId,
    },
  });
};
