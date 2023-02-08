const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    products:{
        type: Array,
        required: true
    }
})

const Cart = mongoose.model('Cart', CartSchema);

module.exports = {
    Cart
};