import { CHATMAN_PRIVATE_API, ENDPOINTS } from "./api";

export async function uploadImage(file: FormData): Promise<UploadResult> {
  try {
    const { data } = await CHATMAN_PRIVATE_API({
      method: "POST",
      url: ENDPOINTS.uploadImage,
      data: file,
    });
    return data;
  } catch (error) {
    throw error;
  }
}
