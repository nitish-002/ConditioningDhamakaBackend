const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { isAuthenticated, authorize } = require('../middleware/auth');
const router = express.Router();

// Apply authentication middleware to all routes
router.use(isAuthenticated, authorize('customer'));

// Create order (Customer only endpoint)
router.post('/order', async (req, res) => {
  try {
    const { product_id, quantity, selected_size, selected_color } = req.body;
    
    // Validate product exists
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check if product has enough quantity
    if (product.available_quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Not enough quantity available'
      });
    }
    
    // Validate size and color
    if (!product.sizes.includes(selected_size)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid size selection'
      });
    }
    
    if (!product.colors.includes(selected_color)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid color selection'
      });
    }
    
    // Create the order
    const order = await Order.create({
      user_id: req.user._id,
      product_id,
      quantity,
      selected_size,
      selected_color
    });
    
    // Update product quantity
    await Product.findByIdAndUpdate(
      product_id,
      { $inc: { available_quantity: -quantity } }
    );
    
    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
});

// Get customer's orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find({ user_id: req.user._id })
      .populate('product_id', 'title price image')
      .populate('assigned_rider', 'name email photo');
    
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

module.exports = router;
