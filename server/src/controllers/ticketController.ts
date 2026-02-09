import { Response } from "express";
import { supabase } from "../config/db";
import { AuthRequest } from "../types";

export async function getTickets(req: AuthRequest, res: Response): Promise<void> {
  const user = req.user!;

  const status = req.query.status as string | undefined;
  const priority = req.query.priority as string | undefined;
  const search = req.query.search as string | undefined;
  const page = parseInt((req.query.page as string) || "1");
  const limit = parseInt((req.query.limit as string) || "20");
  const offset = (page - 1) * limit;

  let query = supabase
    .from("tickets")
    .select("*, creator:users!created_by(id, name, email), assignee:users!assigned_to(id, name, email)", { count: "exact" });

  if (user.role !== "admin") {
    query = query.eq("created_by", user.userId);
  }

  if (status) query = query.eq("status", status);
  if (priority) query = query.eq("priority", priority);
  if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);

  query = query.order("created_at", { ascending: false }).range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    res.status(500).json({ error: "Failed to fetch tickets" });
    return;
  }

  res.json({
    tickets: data,
    pagination: { page, limit, total: count || 0, totalPages: Math.ceil((count || 0) / limit) },
  });
}

export async function createTicket(req: AuthRequest, res: Response): Promise<void> {
  const user = req.user!;

  try {
    const { title, description, priority, assigned_to } = req.body;

    if (!title || !description) {
      res.status(400).json({ error: "Title and description are required" });
      return;
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
      res.status(500).json({ error: "Failed to create ticket" });
      return;
    }

    res.status(201).json({ ticket: data });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getTicketById(req: AuthRequest, res: Response): Promise<void> {
  const user = req.user!;
  const { id } = req.params;

  const { data, error } = await supabase
    .from("tickets")
    .select("*, creator:users!created_by(id, name, email), assignee:users!assigned_to(id, name, email)")
    .eq("id", id)
    .single();

  if (error || !data) {
    res.status(404).json({ error: "Ticket not found" });
    return;
  }

  if (user.role !== "admin" && data.created_by !== user.userId) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  res.json({ ticket: data });
}

export async function updateTicket(req: AuthRequest, res: Response): Promise<void> {
  const user = req.user!;
  const { id } = req.params;

  const { data: existing } = await supabase
    .from("tickets")
    .select("*")
    .eq("id", id)
    .single();

  if (!existing) {
    res.status(404).json({ error: "Ticket not found" });
    return;
  }

  if (user.role !== "admin" && existing.created_by !== user.userId) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  try {
    const body = req.body;
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
      res.status(500).json({ error: "Failed to update ticket" });
      return;
    }

    res.json({ ticket: data });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteTicket(req: AuthRequest, res: Response): Promise<void> {
  const user = req.user!;
  const { id } = req.params;

  const { data: existing } = await supabase
    .from("tickets")
    .select("*")
    .eq("id", id)
    .single();

  if (!existing) {
    res.status(404).json({ error: "Ticket not found" });
    return;
  }

  if (user.role !== "admin" && existing.created_by !== user.userId) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const { error } = await supabase.from("tickets").delete().eq("id", id);

  if (error) {
    res.status(500).json({ error: "Failed to delete ticket" });
    return;
  }

  res.json({ message: "Ticket deleted" });
}
