
export interface IAuthRequest {
  email: string;
  password: string;
}

export interface IAuthResponse {
  success: string;
  statusCode: number;
  message: string;
  token: string;
}

export type IRefreshTokenResponse = {
  accessToken: string;
};