export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
  posts: Post[];
  comments: Comment[];
}

export interface Post {
  id: number;
  title: string;
  content: string;
  image: string;
  tags: string[];
  createdAt: Date;
  autherId: number;
  auther: User;
  comments: Comment[];
}

export interface Comment {
  id: number;
  content: string;
  createdAt: Date;
  postId: number;
  post: Post;
  autherId: number;
  auther: User;
  parentId: number | null;
  parent: Comment | null;
  replies: Comment[];
}