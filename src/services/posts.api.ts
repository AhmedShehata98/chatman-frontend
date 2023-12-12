import { CHATMAN_PRIVATE_API, ENDPOINTS } from "./api";

export async function getAllPosts({
  feedId,
  limit,
  page,
}: {
  feedId: string;
  limit: number;
  page: number;
}): Promise<{ total: number; posts: Post[] }> {
  try {
    const { data } = await CHATMAN_PRIVATE_API({
      method: "GET",
      url: `${ENDPOINTS.posts}/${feedId}`,
      params: { limit, page },
    });
    return data;
  } catch (error) {
    throw error;
  }
}
export async function createPost(post: CreatePost): Promise<Post> {
  try {
    const { data } = await CHATMAN_PRIVATE_API({
      method: "POST",
      url: ENDPOINTS.posts,
      data: post,
    });
    return data;
  } catch (error) {
    throw error;
  }
}
