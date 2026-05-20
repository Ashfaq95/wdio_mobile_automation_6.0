import loginApi from "./login.api";

export class LoginResponse {
  token: string = "";
  userId: string = "";
  userName: string = "";
  email: string = "";
  expiresIn: number = 0;
  statusCode: number = 0;
  message: string = "";

  static fromJson(data: Record<string, unknown>): LoginResponse {
    const response = new LoginResponse();
    response.token = (data.token as string) || "";
    response.userId = (data.userId as string) || "";
    response.userName = (data.userName as string) || "";
    response.email = (data.email as string) || "";
    response.expiresIn = (data.expiresIn as number) || 0;
    response.statusCode = (data.statusCode as number) || 0;
    response.message = (data.message as string) || "";
    return response;
  }
}

export class LoginMethods {
  async performLogin(
    username: string,
    password: string,
  ): Promise<LoginResponse> {
    const data = await loginApi.getLoginResponse(username, password);
    return LoginResponse.fromJson(data);
  }

  async refreshToken(token: string): Promise<LoginResponse> {
    const data = await loginApi.getRefreshTokenResponse(token);
    return LoginResponse.fromJson(data);
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      await loginApi.getValidateTokenResponse(token);
      return true;
    } catch {
      return false;
    }
  }
}
