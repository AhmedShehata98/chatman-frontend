import { CHATMAN_API, CHATMAN_PRIVATE_API, ENDPOINTS } from "./api";
import Cookies from "js-cookie";

export async function createAccount(
  form: Signup,
): Promise<{ message: string; token: string }> {
  try {
    const { data } = await CHATMAN_API({
      method: "POST",
      url: ENDPOINTS.signup,
      data: form,
    });
    if (data.token) {
      Cookies.set("token", data.token);
      Cookies.set("isLoggedIn", "true");
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function login(
  form: Login,
): Promise<{ message: string; token: string }> {
  try {
    const { data } = await CHATMAN_API({
      method: "POST",
      url: ENDPOINTS.login,
      data: form,
    });
    if (data.token) {
      Cookies.set("token", data.token);
      Cookies.set("isLoggedIn", "true");
    }
    return data;
  } catch (error) {
    throw error;
  }
}
export async function getUserData(
  token: string,
): Promise<{ message: string; data: User }> {
  try {
    const { data } = await CHATMAN_PRIVATE_API({
      method: "GET",
      url: ENDPOINTS.userData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
}
export async function searchUsers(
  query: string,
): Promise<{ message: string; users: User[] }> {
  try {
    const { data } = await CHATMAN_PRIVATE_API({
      method: "GET",
      url: `${ENDPOINTS.searchUsers}?q=${query}`,
    });
    return data;
  } catch (error) {
    throw error;
  }
}
