import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthToken extends JwtPayload {
  id: string;
  role: string;
}

export function verifyToken(token: string): AuthToken | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthToken;
    return decoded;
  } catch (err) {
    return null;
  }
}
