import { CHATMAN_PRIVATE_API, ENDPOINTS } from "./api";

export async function addFeed(feedData: CreateFeed): Promise<IFeed> {
  try {
    const { data } = await CHATMAN_PRIVATE_API({
      method: "POST",
      url: ENDPOINTS.feeds,
      data: feedData,
    });
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getAllFeeds({
  limit,
  page,
  token,
}: {
  limit: number;
  page: number;
  token?: string;
}): Promise<{ total: number; data: IFeed[] }> {
  try {
    const { data } = await CHATMAN_PRIVATE_API({
      method: "GET",
      url: ENDPOINTS.feeds,
      params: { limit, page },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getFeedById(feedId: string): Promise<IFeed> {
  try {
    const { data } = await CHATMAN_PRIVATE_API({
      method: "GET",
      url: `${ENDPOINTS.feeds}/${feedId}`,
    });
    return data;
  } catch (error) {
    throw error;
  }
}
