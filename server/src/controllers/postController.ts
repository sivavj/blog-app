import e, { Request, Response } from "express";
import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  updatePost,
} from "../services/postService";

export const createPostController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { authorId, title, content, tags } = req.body;
    const imagePath = req.file?.path;

    if (!authorId) {
      return res.status(400).json({ message: "Author ID is required" });
    }

    if (!imagePath) {
      return res.status(400).json({ message: "Image is required" });
    }

    const authorIdInt = parseInt(authorId, 10);

    if (isNaN(authorIdInt)) {
      return res
        .status(400)
        .json({ message: "Author ID must be a valid number" });
    }

    const tagArray = Array.isArray(tags) ? tags : tags ? tags.split(",") : [];

    const post = await createPost(
      {
        authorId,
        title,
        content,
        tags: tagArray,
      },
      imagePath
    );
    return res.status(201).json({
      message: "Post created successfully",
      data: post,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPostsController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { page, limit, search, tags, autherId } = req.query;

    const posts = await getPosts({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      search: search as string,
      tags: tags ? (tags as string).split(",") : undefined,
      autherId: autherId ? Number(autherId) : undefined,
    });
    return res.status(200).json(posts);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPostByIdController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { postId } = req.params;
    const post = await getPostById(Number(postId));

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    return res.status(200).json({
      data: post,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePostController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { postId } = req.params;
    const { title, content, tags, authorId } = req.body;
    const imagePath = req.file?.path;

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    const updatedPost = await updatePost(
      Number(postId),
      {
        title,
        content,
        tags,
        authorId,
      },
      imagePath
    );
    return res.status(200).json({
      message: "Post updated successfully",
      data: updatedPost,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePostController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { postId } = req.params;
    const post = await getPostById(Number(postId));
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    await deletePost(Number(postId));
    return res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
