import { NextRequest, NextResponse } from "next/server";
import { authorizeAdmin } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

// GET /api/admin/users - list all users (admin only)
export async function GET(req: NextRequest) {
  const admin = authorizeAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, role, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }

  return NextResponse.json({ users: data });
}
