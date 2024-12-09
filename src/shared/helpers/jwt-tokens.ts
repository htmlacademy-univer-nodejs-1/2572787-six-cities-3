import { SignJWT } from "jose";

const JWT_EXPIRED = '3d';

export async function getTokens(tokenData: Record<string, any>, secretKey: Uint8Array): Promise<string> {
  const accessToken = await new SignJWT(tokenData)
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRED)
    .sign(secretKey);

  return accessToken;
}
