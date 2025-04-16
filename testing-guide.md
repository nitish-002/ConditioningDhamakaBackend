# E-commerce API Testing Guide

This guide helps you test the E-commerce API using Postman.

## Setup

1. Start the Express server:
   ```
   npm run dev
   ```

2. Import the Postman collection:
   - Open Postman
   - Click on "Import" button
   - Select the file: `ecommerce-api.postman_collection.json`

3. Make sure you have seeded the database with the required data:
   ```
   npm run seed
   ```

## Testing Flow

### 1. Authentication

1. **Register Users**: 
   - Register a customer, admin, and rider
   - Note: Admin and rider registration requires the email to be in the approved_emails collection

2. **Login**:
   - Login as the user you want to test with
   - The session cookie will be automatically saved by Postman

### 2. Products

1. **Get Products**:
   - Retrieve all products
   - Get a specific product by ID (replace `{{product_id}}` with an actual ID)

2. **Create/Update Products** (Admin only):
   - Make sure you're logged in as an admin
   - Create a new product
   - Update an existing product

### 3. Orders

1. **Create an Order** (Customer only):
   - Log in as a customer
   - Create an order using a valid product ID
   - Make sure to specify quantity, size, and color

2. **View Orders**:
   - Customers can view their own orders
   - Admins can view all orders

3. **Assign Rider** (Admin only):
   - Log in as an admin
   - Assign a rider to an order

4. **Manage Deliveries** (Rider only):
   - Log in as a rider
   - View assigned orders
   - Update order status to "shipped" or "delivered"

### Common Issues

1. **Authentication Errors**:
   - If you see "Not authenticated" errors, make sure you're logged in
   - Login requests should be successful before attempting protected routes
   - Sessions expire after a period of inactivity

2. **Role-Based Access**:
   - Some routes are restricted by role
   - Make sure you're logged in with the appropriate role for each request

3. **Invalid IDs**:
   - Replace all placeholder IDs in the requests with actual IDs from your database
   - Use the "Get All" endpoints to find valid IDs
