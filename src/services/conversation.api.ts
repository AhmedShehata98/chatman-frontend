import { CHATMAN_PRIVATE_API, ENDPOINTS } from "./api";

export async function createConversation(conversationData: CreateConversation) {
  try {
    const { data } = await CHATMAN_PRIVATE_API({
      method: "POST",
      url: `${ENDPOINTS.conversation}`,
      data: conversationData,
    });
    return data;
  } catch (error) {
    throw error;
  }
}

export async function userConversations({
  token,
  q = "",
}: {
  token?: string;
  q?: string;
}): Promise<Conversation[]> {
  try {
    const { data } = await CHATMAN_PRIVATE_API({
      method: "GET",
      url: `${ENDPOINTS.conversation}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { q },
    });
    return data;
  } catch (error) {
    throw error;
  }
}
export async function addLastMessage({
  conversationId,
  lastMessageId,
}: {
  conversationId: string;
  lastMessageId: string;
}) {
  try {
    const { data } = await CHATMAN_PRIVATE_API({
      method: "PUT",
      url: ENDPOINTS.conversation,
      data: { conversationId, lastMessageId },
    });
    return data;
  } catch (error) {
    throw error;
  }
}
export async function deleteConversation(conversationId: string) {
  try {
    const { data } = await CHATMAN_PRIVATE_API({
      method: "DELETE",
      url: `${ENDPOINTS.conversation}/${conversationId}`,
    });
    return data;
  } catch (error) {
    throw error;
  }
}
