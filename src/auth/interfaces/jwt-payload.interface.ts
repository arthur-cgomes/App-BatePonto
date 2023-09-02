export interface JwtPayload {
  userId: string;
  email: string;
}

export interface JwtResponse {
  expiresIn: number;
  token: string;
  userId: string;
}
