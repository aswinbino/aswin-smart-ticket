const asyncHandler = require('express-async-handler');
const Ticket = require('../models/Ticket');
const User = require('../models/User');

// @desc    Get ticket stats
// @route   GET /api/tickets/stats
// @access  Private (Admin only)
const getTicketStats = asyncHandler(async (req, res) => {
    // Get user using the id in the JWT
    const user = await User.findById(req.user.id);

    if (!user) {
        res.status(401);
        throw new Error('User not found');
    }

    if (user.role !== 'admin') {
        res.status(401);
        throw new Error('Not Authorized as Admin');
    }

    const stats = await Ticket.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);

    const formattedStats = {
        new: 0,
        open: 0,
        closed: 0
    };

    stats.forEach(stat => {
        formattedStats[stat._id] = stat.count;
    });

    res.status(200).json(formattedStats);
});

module.exports = {
    getTicketStats
};
