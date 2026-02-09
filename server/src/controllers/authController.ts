import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { supabase } from "../config/db";
import { signToken } from "../middleware/auth";
import { AuthRequest } from "../types";

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: "Name, email, and password are required" });
      return;
    }

    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existing) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role === "admin" ? "admin" : "user";

    const { data: user, error } = await supabase
      .from("users")
      .insert({ name, email, password: hashedPassword, role: userRole })
      .select("id, name, email, role, created_at")
      .single();

    if (error) {
      res.status(500).json({ error: "Failed to create user" });
      return;
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    res.status(201).json({ user, token });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    const { password: _, ...userWithoutPassword } = user;

    res.json({ user: userWithoutPassword, token });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function me(req: AuthRequest, res: Response): Promise<void> {
  const user = req.user!;

  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, role, created_at")
    .eq("id", user.userId)
    .single();

  if (error || !data) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json({ user: data });
}
