import { CHATMAN_API, CHATMAN_PRIVATE_API, ENDPOINTS } from "./api";

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
export async function getReactions({ postId }: { postId: string }) {
  try {
    const { data } = await CHATMAN_API({
      url: `${ENDPOINTS.postReactions}/${postId}`,
    });
    return data;
  } catch (error) {
    throw error;
  }
}
export async function getPostById(postId: string) {
  try {
    const { data } = await CHATMAN_API({
      method: "GET",
      url: `${ENDPOINTS.postsDetails}/${postId}`,
    });
    return data;
  } catch (error) {
    throw error;
  }
}
export async function addReaction({
  postId,
  token,
}: {
  postId: string;
  token: string;
}) {
  try {
    const { data } = await CHATMAN_API({
      method: "PUT",
      url: `${ENDPOINTS.postReactions}/${postId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
}
export async function deleteReaction({
  postId,
  token,
}: {
  postId: string;
  token: string;
}) {
  try {
    const { data } = await CHATMAN_API({
      method: "DELETE",
      url: `${ENDPOINTS.postReactions}/${postId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
}
export async function deletePost({ postId }: { postId: string }) {
  try {
    const { data } = await CHATMAN_PRIVATE_API({
      method: "DELETE",
      url: `${ENDPOINTS.posts}/${postId}`,
    });
    return data;
  } catch (error) {
    throw error;
  }
}
export async function updatePost({ postId }: { postId: string }) {
  try {
    const { data } = await CHATMAN_PRIVATE_API({
      method: "PUT",
      url: `${ENDPOINTS.posts}/${postId}`,
    });
    return data;
  } catch (error) {
    throw error;
  }
}
export async function addComment(comment: CreateComment) {
  try {
    const { data } = await CHATMAN_PRIVATE_API({
      method: "POST",
      url: `${ENDPOINTS.comments}`,
      data: comment,
    });
    return data;
  } catch (error) {
    throw error;
  }
}
export async function getComments({
  limit,
  page,
  postId,
}: {
  postId: string;
  limit?: number;
  page?: number;
}) {
  try {
    const { data } = await CHATMAN_API({
      url: `${ENDPOINTS.comments}/${postId}`,
      params: { limit, page },
    });

    return data;
  } catch (error) {
    throw error;
  }
}
