const express = require('express');
const { getCartData, createCart, deleteCart } = require('../handlers/Cart');

const cartRoutes = express.Router()


cartRoutes.get("/getcart",getCartData)
cartRoutes.post("/addcart",createCart)
cartRoutes.delete("/deletecart/:name",deleteCart)

module.exports = {
    cartRoutes
}

