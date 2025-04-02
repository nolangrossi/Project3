import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface JwtPayload {
  _id: string;
  username: string;
  email: string;
}

export const authenticateToken = (token: string): JwtPayload | null => {
  try {
    const secretKey = process.env.JWT_SECRET as string;
    return jwt.verify(token, secretKey) as JwtPayload;
  } catch (error) {
    return null;
  }
};

export const signToken = (username: string, email: string, _id: string) => {
  const payload: JwtPayload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET as string;
  return jwt.sign(payload, secretKey, { expiresIn: "1h" });
};
