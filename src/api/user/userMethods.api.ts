import axios from "axios";
import endpoints from "../endpoints.json";
import { getApiServiceUrl, getUserAgent } from "../../utils/api.helper";
import userApi from "./user.api";

export class UserResponse {
  userId: string = "";
  userName: string = "";
  email: string = "";
  firstName: string = "";
  lastName: string = "";
  phone: string = "";
  avatar: string = "";
  statusCode: number = 0;
  message: string = "";

  static fromJson(data: Record<string, unknown>): UserResponse {
    const response = new UserResponse();
    response.userId = (data.userId as string) || "";
    response.userName = (data.userName as string) || "";
    response.email = (data.email as string) || "";
    response.firstName = (data.firstName as string) || "";
    response.lastName = (data.lastName as string) || "";
    response.phone = (data.phone as string) || "";
    response.avatar = (data.avatar as string) || "";
    response.statusCode = (data.statusCode as number) || 0;
    response.message = (data.message as string) || "";
    return response;
  }
}

class UserMethodsApi {
  private get accessToken(): string {
    return process.env.ACCESS_TOKEN || "";
  }

  async getUserProfile(userId: string): Promise<UserResponse> {
    const data = await userApi.getUserProfileResponse(userId);
    return UserResponse.fromJson(data);
  }

  async updateUserProfileResponse(
    userId: string,
    data: Record<string, unknown>,
  ) {
    const url = getApiServiceUrl() + `${endpoints.users}/${userId}`;
    const response = await axios.put(url, data, {
      headers: {
        Accept: "application/json",
        "User-Agent": getUserAgent(),
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    return response.data;
  }

  async deleteUserResponse(userId: string) {
    const url = getApiServiceUrl() + `${endpoints.users}/${userId}`;
    const response = await axios.delete(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": getUserAgent(),
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    return response;
  }

  async updateUserProfile(
    userId: string,
    data: Partial<UserResponse>,
  ): Promise<UserResponse> {
    const raw = await this.updateUserProfileResponse(
      userId,
      data as Record<string, unknown>,
    );
    return UserResponse.fromJson(raw);
  }

  async deleteUser(userId: string): Promise<boolean> {
    try {
      const response = await this.deleteUserResponse(userId);
      return response.status === 200;
    } catch {
      return false;
    }
  }
}

export default new UserMethodsApi();
