import axios from "axios";
import endpoints from "../endpoints.json";
import { getApiServiceUrl, getUserAgent } from "../../utils/api.helper";

class LoginApi {
  async getLoginResponse(username: string, password: string) {
    const url = getApiServiceUrl() + endpoints.login;
    const response = await axios.post(
      url,
      { username, password },
      {
        headers: {
          Accept: "application/json",
          "User-Agent": getUserAgent(),
        },
      },
    );
    return response.data;
  }

  async getRefreshTokenResponse(token: string) {
    const url = getApiServiceUrl() + endpoints.refreshToken;
    const response = await axios.post(
      url,
      { token },
      {
        headers: {
          Accept: "application/json",
          "User-Agent": getUserAgent(),
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  }

  async getValidateTokenResponse(token: string) {
    const url = getApiServiceUrl() + endpoints.validateToken;
    const response = await axios.get(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": getUserAgent(),
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
}

export default new LoginApi();
