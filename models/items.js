const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, {timestamps: true});

// Item is the singular form of collection name
const Item = mongoose.model('Item', itemSchema);
module.exports = Item;