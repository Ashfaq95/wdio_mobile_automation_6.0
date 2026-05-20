import axios from "axios";
import { getApiServiceUrl, getUserAgent } from "../../utils/app.helper";

const API_BASE_URL = getApiServiceUrl();
const LOGIN_URL = API_BASE_URL + "/auth/login";
const REFRESH_TOKEN_URL = API_BASE_URL + "/auth/refresh";
const VALIDATE_TOKEN_URL = API_BASE_URL + "/auth/validate";

class LoginApi {
  async getLoginResponse(username: string, password: string) {
    const response = await axios.post(
      LOGIN_URL,
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
    const response = await axios.post(
      REFRESH_TOKEN_URL,
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
    const response = await axios.get(VALIDATE_TOKEN_URL, {
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
