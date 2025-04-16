const express = require('express');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const { isAuthenticated, authorize } = require('../middleware/auth');
const router = express.Router();

// Apply authentication middleware to all routes
router.use(isAuthenticated, authorize('admin'));

// Add product (Admin only endpoint)
router.post('/product', async (req, res) => {
  try {
    const { title, description, price, image, sizes, colors, available_quantity } = req.body;
    
    // Validate required fields
    if (!title || !description || !price || !image || !available_quantity) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, price, image, and available_quantity'
      });
    }
    
    // Create product
    const product = await Product.create({
      title,
      description,
      price,
      image,
      sizes: sizes || ['S', 'M', 'L', 'XL'],
      colors: colors || ['Black', 'White', 'Red', 'Blue'],
      available_quantity
    });
    
    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding product',
      error: error.message
    });
  }
});

// Get all orders (Admin dashboard)
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user_id', 'name email')
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
