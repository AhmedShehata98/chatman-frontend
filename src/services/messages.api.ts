import { CHATMAN_PRIVATE_API, ENDPOINTS } from "./api";

export async function getConversationMessages(
  conversationId: string,
): Promise<Message[]> {
  try {
    const { data } = await CHATMAN_PRIVATE_API({
      url: `${ENDPOINTS.messages}/${conversationId}`,
    });
    return data;
  } catch (error) {
    throw error;
  }
}
export async function clearMessages(conversationId: string) {
  try {
    const { data } = await CHATMAN_PRIVATE_API({
      method: "DELETE",
      url: `${ENDPOINTS.clearMessages}/${conversationId}`,
    });
    return data;
  } catch (error) {
    throw error;
  }
}
