import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

// GET /api/tickets - list tickets (admin sees all, user sees own)
export async function GET(req: NextRequest) {
  const user = authenticate(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const priority = searchParams.get("priority");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = (page - 1) * limit;

  let query = supabase
    .from("tickets")
    .select("*, creator:users!created_by(id, name, email), assignee:users!assigned_to(id, name, email)", { count: "exact" });

  // Users only see their own tickets
  if (user.role !== "admin") {
    query = query.eq("created_by", user.userId);
  }

  if (status) query = query.eq("status", status);
  if (priority) query = query.eq("priority", priority);
  if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);

  query = query.order("created_at", { ascending: false }).range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }

  return NextResponse.json({
    tickets: data,
    pagination: { page, limit, total: count || 0, totalPages: Math.ceil((count || 0) / limit) },
  });
}

// POST /api/tickets - create a ticket
export async function POST(req: NextRequest) {
  const user = authenticate(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, description, priority, assigned_to } = await req.json();

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const ticketData: Record<string, unknown> = {
      title,
      description,
      priority: priority || "medium",
      created_by: user.userId,
      status: "open",
    };

    if (assigned_to && user.role === "admin") {
      ticketData.assigned_to = assigned_to;
    }

    const { data, error } = await supabase
      .from("tickets")
      .insert(ticketData)
      .select("*, creator:users!created_by(id, name, email), assignee:users!assigned_to(id, name, email)")
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
    }

    return NextResponse.json({ ticket: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
