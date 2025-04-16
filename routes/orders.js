const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { isAuthenticated, authorize } = require('../middleware/auth');
const router = express.Router();

// Apply authentication middleware to all routes
router.use(isAuthenticated);

// Create order (customer only)
router.post('/', authorize('customer'), async (req, res) => {
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

// Get current user's orders (customer only)
router.get('/me', authorize('customer'), async (req, res) => {
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

// Get all orders (admin only)
router.get('/', authorize('admin'), async (req, res) => {
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

// Assign a rider to an order (admin only)
router.put('/:id/assign', authorize('admin'), async (req, res) => {
  try {
    const { riderId } = req.body;
    
    if (!riderId) {
      return res.status(400).json({
        success: false,
        message: 'Rider ID is required'
      });
    }
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        assigned_rider: riderId,
        status: 'assigned'
      },
      { new: true, runValidators: true }
    )
    .populate('assigned_rider', 'name email photo');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error assigning rider',
      error: error.message
    });
  }
});

// Get orders assigned to current rider (rider only)
router.get('/assigned', authorize('rider'), async (req, res) => {
  try {
    const orders = await Order.find({ assigned_rider: req.user._id })
      .populate('user_id', 'name email')
      .populate('product_id', 'title price image');
    
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching assigned orders',
      error: error.message
    });
  }
});

// Update order status (rider only)
router.put('/:id/status', authorize('rider'), async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status
    if (!status || !['shipped', 'delivered'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either shipped or delivered'
      });
    }
    
    // Check if order is assigned to this rider
    const order = await Order.findOne({
      _id: req.params.id,
      assigned_rider: req.user._id
    });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or not assigned to you'
      });
    }
    
    // Update the status
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
});

module.exports = router;
