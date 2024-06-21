export interface AuthSignInRequest {
  email: string;
  password?: string;
}

export interface AuthSignInResponse {
  token: string;
}
