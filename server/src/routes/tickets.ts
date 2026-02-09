import { Router } from "express";
import { getTickets, createTicket, getTicketById, updateTicket, deleteTicket } from "../controllers/ticketController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, getTickets);
router.post("/", authenticate, createTicket);
router.get("/:id", authenticate, getTicketById);
router.put("/:id", authenticate, updateTicket);
router.delete("/:id", authenticate, deleteTicket);

export default router;
