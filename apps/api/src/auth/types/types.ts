export interface JwtPayload {
  sub: string;
  email: string;
}

export interface CurrentJwtUser {
  id: string;
  email: string;
}
