import { Request } from "express";

export interface JWTPayload {
  userId: string;
  email: string;
  role: "admin" | "user";
}

export interface AuthRequest extends Request {
  user?: JWTPayload;
}
