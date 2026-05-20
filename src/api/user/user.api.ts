import axios from "axios";
import { getApiServiceUrl, getUserAgent } from "../../utils/app.helper";

const API_BASE_URL = getApiServiceUrl();
const USERS_URL = API_BASE_URL + "/users";

class UserApi {
  private get accessToken(): string {
    return process.env.ACCESS_TOKEN || "";
  }

  async getUserProfileResponse(userId: string) {
    const response = await axios.get(`${USERS_URL}/${userId}`, {
      headers: {
        Accept: "application/json",
        "User-Agent": getUserAgent(),
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    return response.data;
  }
}

export default new UserApi();
