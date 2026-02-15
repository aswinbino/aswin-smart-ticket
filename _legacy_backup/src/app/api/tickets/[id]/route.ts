import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

// GET /api/tickets/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = authenticate(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { data, error } = await supabase
    .from("tickets")
    .select("*, creator:users!created_by(id, name, email), assignee:users!assigned_to(id, name, email)")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  // Users can only see their own tickets
  if (user.role !== "admin" && data.created_by !== user.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ ticket: data });
}

// PUT /api/tickets/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = authenticate(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Verify ticket exists and user has access
  const { data: existing } = await supabase
    .from("tickets")
    .select("*")
    .eq("id", id)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  if (user.role !== "admin" && existing.created_by !== user.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (body.title) updates.title = body.title;
    if (body.description) updates.description = body.description;
    if (body.status) updates.status = body.status;
    if (body.priority) updates.priority = body.priority;
    if (body.assigned_to !== undefined && user.role === "admin") {
      updates.assigned_to = body.assigned_to || null;
    }

    const { data, error } = await supabase
      .from("tickets")
      .update(updates)
      .eq("id", id)
      .select("*, creator:users!created_by(id, name, email), assignee:users!assigned_to(id, name, email)")
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 });
    }

    return NextResponse.json({ ticket: data });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/tickets/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = authenticate(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { data: existing } = await supabase
    .from("tickets")
    .select("*")
    .eq("id", id)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  if (user.role !== "admin" && existing.created_by !== user.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await supabase.from("tickets").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete ticket" }, { status: 500 });
  }

  return NextResponse.json({ message: "Ticket deleted" });
}
