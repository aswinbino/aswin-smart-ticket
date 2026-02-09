import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const user = authenticate(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, role, created_at")
    .eq("id", user.userId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user: data });
}
