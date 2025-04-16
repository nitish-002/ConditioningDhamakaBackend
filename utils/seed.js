const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const ApprovedEmail = require('../models/ApprovedEmail');

// Load environment variables
dotenv.config();

// Sample products data
const products = [
  {
    title: 'Classic T-Shirt',
    description: 'A comfortable cotton t-shirt for everyday wear',
    price: 19.99,
    image: 'https://example.com/images/tshirt.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Navy', 'Gray'],
    available_quantity: 100
  },
  {
    title: 'Slim Fit Jeans',
    description: 'Modern slim fit jeans with stretch fabric for maximum comfort',
    price: 49.99,
    image: 'https://example.com/images/jeans.jpg',
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['Blue', 'Black', 'Gray'],
    available_quantity: 75
  },
  {
    title: 'Running Shoes',
    description: 'Lightweight running shoes with cushioned insoles for comfort',
    price: 89.99,
    image: 'https://example.com/images/shoes.jpg',
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['Black', 'White', 'Red', 'Blue'],
    available_quantity: 50
  }
];

// Approved emails for testing
const approvedEmails = [
  { email: 'admin@example.com' },
  { email: 'rider1@example.com' },
  { email: 'rider2@example.com' },
  { email: 'customer@example.com' }
];

// Function to reset collections and seed data
const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 15000
    });

    console.log('MongoDB Connected');

    // Clear existing data
    await Product.deleteMany({});
    await ApprovedEmail.deleteMany({});

    console.log('Data cleared');

    // Seed products
    await Product.insertMany(products);
    console.log(`${products.length} products seeded`);

    // Seed approved emails
    await ApprovedEmail.insertMany(approvedEmails);
    console.log(`${approvedEmails.length} approved emails seeded`);

    console.log('Data seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedData();
