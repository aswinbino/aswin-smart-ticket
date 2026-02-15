const mongoose = require('mongoose');

const ticketSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: [true, 'Please select a ticket type'],
    },
    description: {
        type: String,
        required: [true, 'Please enter a description of the issue'],
        maxlength: 500
    },
    status: {
        type: String,
        required: true,
        enum: ['new', 'open', 'closed'],
        default: 'new'
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Ticket', ticketSchema);
