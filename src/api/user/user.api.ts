import axios from "axios";
import endpoints from "../endpoints.json";
import { getApiServiceUrl, getUserAgent } from "../../utils/api.helper";

class UserApi {
  private get accessToken(): string {
    return process.env.ACCESS_TOKEN || "";
  }

  async getUserProfileResponse(userId: string) {
    const url = getApiServiceUrl() + `${endpoints.users}/${userId}`;
    const response = await axios.get(url, {
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
