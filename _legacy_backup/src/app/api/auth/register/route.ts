import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { supabase } from "@/lib/supabase";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role === "admin" ? "admin" : "user";

    const { data: user, error } = await supabase
      .from("users")
      .insert({ name, email, password: hashedPassword, role: userRole })
      .select("id, name, email, role, created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    return NextResponse.json({ user, token }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
