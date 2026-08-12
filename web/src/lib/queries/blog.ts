import "server-only";
import { connectToDatabase } from "@/lib/db";
import { BlogPost, type BlogPostDoc } from "@/models/Blog";
import { toPlain } from "@/lib/serialize";

export async function getBlogPosts(): Promise<BlogPostDoc[]> {
  await connectToDatabase();
  const posts = await BlogPost.find().sort({ createdAt: -1 }).lean();
  return toPlain(posts);
}

export async function getBlogPost(id: string): Promise<BlogPostDoc | null> {
  await connectToDatabase();
  const post = await BlogPost.findById(id).lean();
  return post ? toPlain(post) : null;
}
