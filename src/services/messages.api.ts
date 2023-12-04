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
