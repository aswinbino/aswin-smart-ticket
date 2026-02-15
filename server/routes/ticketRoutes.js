const express = require('express');
const router = express.Router();
const {
    getTickets,
    getTicket,
    createTicket,
    deleteTicket,
    updateTicket
} = require('../controllers/ticketController');
const { getTicketStats } = require('../controllers/statsController');

const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getTickets).post(protect, createTicket);
router.route('/stats').get(protect, getTicketStats);
router.route('/:id')
    .get(protect, getTicket)
    .delete(protect, deleteTicket)
    .put(protect, updateTicket);

module.exports = router;
