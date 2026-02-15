import { Response } from "express";
import { supabase } from "../config/db";
import { AuthRequest } from "../types";

export async function getUsers(req: AuthRequest, res: Response): Promise<void> {
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, role, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    res.status(500).json({ error: "Failed to fetch users" });
    return;
  }

  res.json({ users: data });
}
