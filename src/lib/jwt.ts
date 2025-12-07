import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export interface AuthToken extends JwtPayload {
  id: string;
  role: string;
}

export function signToken(payload: { id: string; role: string }) {
  return jwt.sign(payload, SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): AuthToken | null {
  try {
    const decoded = jwt.verify(token, SECRET) as AuthToken;
    return decoded;
  } catch (err) {
    return null;
  }
}
