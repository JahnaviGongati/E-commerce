const express = require("express");
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// =========================
// PLACE ORDER
// =========================

router.post("/", authMiddleware, async (req, res) => {
    try {
        const {
            products,
            totalAmount,
            customerDetails
        } = req.body;

        // Validate order data
        if (
            !products ||
            products.length === 0 ||
            !totalAmount ||
            !customerDetails
        ) {
            return res.status(400).json({
                message: "Please provide all order details"
            });
        }

        // Create order
        const order = await Order.create({
            user: req.user.userId,
            products,
            totalAmount,
            customerDetails
        });

        res.status(201).json({
            message: "Order placed successfully",
            order
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to place order",
            error: error.message
        });
    }
});

// =========================
// GET MY ORDERS
// =========================

router.get("/", authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user.userId
        })
        .populate("products.product")
        .sort({ createdAt: -1 });

        res.json(orders);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch orders",
            error: error.message
        });
    }
});

// =========================
// GET SINGLE ORDER
// =========================

router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user.userId
        }).populate("products.product");

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.json(order);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch order",
            error: error.message
        });
    }
});

module.exports = router;