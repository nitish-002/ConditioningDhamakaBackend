const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const ApprovedEmail = require('../models/ApprovedEmail');
const User = require('../models/User');

// Load environment variables
dotenv.config();

// Sample products data
const products = [
  {
    "title": "Split Air Conditioner",
    "description": "Energy-efficient split AC with fast cooling and low noise operation",
    "price": 349.99,
    "image": "https://i.imgur.com/8yUf7UL.jpg",
    "sizes": ["1 Ton", "1.5 Ton", "2 Ton"],
    "colors": ["White", "Silver"],
    "available_quantity": 50
  },
  {
    "title": "Window Air Conditioner",
    "description": "Compact window AC perfect for small rooms with easy installation",
    "price": 279.99,
    "image": "https://i.imgur.com/vL9UhWe.jpg",
    "sizes": ["0.8 Ton", "1 Ton", "1.5 Ton"],
    "colors": ["White"],
    "available_quantity": 30
  },
  {
    "title": "Inverter Split AC",
    "description": "Smart inverter AC with Wi-Fi control and 5-star energy rating",
    "price": 499.99,
    "image": "https://i.imgur.com/sn4ofDi.jpg",
    "sizes": ["1 Ton", "1.5 Ton", "2 Ton", "2.5 Ton"],
    "colors": ["White", "Black"],
    "available_quantity": 70
  },
  {
    "title": "Ceiling Fan",
    "description": "High-speed ceiling fan with elegant design and low power consumption",
    "price": 59.99,
    "image": "https://i.imgur.com/RAU7Z6f.jpg",
    "sizes": ["48 inch", "52 inch"],
    "colors": ["Brown", "White", "Ivory"],
    "available_quantity": 120
  },
  {
    "title": "Table Fan",
    "description": "Portable table fan with 3-speed settings and adjustable tilt",
    "price": 34.99,
    "image": "https://i.imgur.com/NKDdASM.jpg",
    "sizes": ["12 inch", "16 inch"],
    "colors": ["Blue", "White", "Gray"],
    "available_quantity": 80
  }
];

// Approved emails for testing
const approvedEmails = [
  { email: 'admin@example.com' },
  { email: 'rider1@example.com' },
  { email: 'rider2@example.com' },
  { email: 'customer@example.com' }
];

// Sample users data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin'
  },
  {
    name: 'Rider One',
    email: 'rider1@example.com',
    password: 'password123',
    role: 'rider'
  },
  {
    name: 'Rider Two',
    email: 'rider2@example.com',
    password: 'password123',
    role: 'rider'
  },
  {
    name: 'Customer User',
    email: 'customer@example.com',
    password: 'password123',
    role: 'customer'
  }
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
    await User.deleteMany({});

    console.log('Data cleared');

    // Seed products
    await Product.insertMany(products);
    console.log(`${products.length} products seeded`);

    // Seed approved emails
    await ApprovedEmail.insertMany(approvedEmails);
    console.log(`${approvedEmails.length} approved emails seeded`);

    // Seed users
    await User.insertMany(users);
    console.log(`${users.length} users seeded`);

    console.log('Data seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedData();
