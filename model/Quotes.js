const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
    quote: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('quotes', quoteSchema);