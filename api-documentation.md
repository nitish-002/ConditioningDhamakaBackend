# E-commerce API Documentation

This document provides examples of how to use the API endpoints with cURL commands.

## Setup

```bash
# Store the API base URL for convenience
API_URL="http://localhost:5000"

# Store cookies in a file to maintain session
COOKIE_FILE="/tmp/cookie.txt"
```

## Authentication Endpoints

### Register User

```bash
# Register a new customer
curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Customer User",
    "email": "customer@example.com",
    "password": "password123",
    "role": "customer"
  }' \
  -c $COOKIE_FILE | json_pp
```

### Register Admin

```bash
# Register an admin user (email must be in approved_emails collection)
curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "password123",
    "role": "admin"
  }' \
  -c $COOKIE_FILE | json_pp
```

### Register Rider

```bash
# Register a rider user (email must be in approved_emails collection)
curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rider User",
    "email": "rider1@example.com",
    "password": "password123",
    "role": "rider"
  }' \
  -c $COOKIE_FILE | json_pp
```

### Login with Email and Password

```bash
# Login with email/password
curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "password123"
  }' \
  -c $COOKIE_FILE | json_pp
```

### Google OAuth Login

```bash
# Initiate Google OAuth login (this needs to be opened in a browser)
# Cannot be directly tested with cURL
open "$API_URL/auth/google"
```

### Check Authentication Status

```bash
# Get current authenticated user details
curl -s -X GET "$API_URL/auth/me" \
  -b $COOKIE_FILE | json_pp
```

### Logout

```bash
# Logout current user
curl -s -X GET "$API_URL/auth/logout" \
  -b $COOKIE_FILE | json_pp
```

## Product Endpoints

### Get All Products

```bash
# Get all products (public)
curl -s -X GET "$API_URL/products" | json_pp
```

### Get Product by ID

```bash
# Replace PRODUCT_ID with an actual product ID
curl -s -X GET "$API_URL/products/PRODUCT_ID" | json_pp
```

### Create New Product (Admin only)

```bash
# Create a new product (must be logged in as admin)
curl -s -X POST "$API_URL/products" \
  -H "Content-Type: application/json" \
  -b $COOKIE_FILE \
  -d '{
    "title": "New Product",
    "description": "This is a new product description",
    "price": 29.99,
    "image": "https://example.com/image.jpg",
    "sizes": ["S", "M", "L"],
    "colors": ["Black", "White", "Red"],
    "available_quantity": 50
  }' | json_pp
```

### Update Product (Admin only)

```bash
# Update a product (must be logged in as admin)
# Replace PRODUCT_ID with an actual product ID
curl -s -X PUT "$API_URL/products/PRODUCT_ID" \
  -H "Content-Type: application/json" \
  -b $COOKIE_FILE \
  -d '{
    "price": 24.99,
    "available_quantity": 75
  }' | json_pp
```

### Delete Product (Admin only)

```bash
# Delete a product (must be logged in as admin)
# Replace PRODUCT_ID with an actual product ID
curl -s -X DELETE "$API_URL/products/PRODUCT_ID" \
  -b $COOKIE_FILE | json_pp
```

## Order Endpoints

### Create Order (Customer only)

```bash
# Create a new order (must be logged in as customer)
# Replace PRODUCT_ID with an actual product ID
curl -s -X POST "$API_URL/orders" \
  -H "Content-Type: application/json" \
  -b $COOKIE_FILE \
  -d '{
    "product_id": "PRODUCT_ID",
    "quantity": 2,
    "selected_size": "M",
    "selected_color": "Black"
  }' | json_pp
```

### Get Current User's Orders (Customer only)

```bash
# Get orders for the currently logged in customer
curl -s -X GET "$API_URL/orders/me" \
  -b $COOKIE_FILE | json_pp
```

### Get All Orders (Admin only)

```bash
# Admin: Get all orders in the system
curl -s -X GET "$API_URL/orders" \
  -b $COOKIE_FILE | json_pp
```

### Assign Rider to Order (Admin only)

```bash
# Admin: Assign a rider to an order
# Replace ORDER_ID and RIDER_USER_ID with actual IDs
curl -s -X PUT "$API_URL/orders/ORDER_ID/assign" \
  -H "Content-Type: application/json" \
  -b $COOKIE_FILE \
  -d '{
    "riderId": "RIDER_USER_ID"
  }' | json_pp
```

### Get Assigned Orders (Rider only)

```bash
# Rider: Get orders assigned to the current rider
curl -s -X GET "$API_URL/orders/assigned" \
  -b $COOKIE_FILE | json_pp
```

### Update Order Status (Rider only)

```bash
# Rider: Update status of an assigned order
# Replace ORDER_ID with an actual order ID
curl -s -X PUT "$API_URL/orders/ORDER_ID/status" \
  -H "Content-Type: application/json" \
  -b $COOKIE_FILE \
  -d '{
    "status": "shipped"
  }' | json_pp

# To mark as delivered:
curl -s -X PUT "$API_URL/orders/ORDER_ID/status" \
  -H "Content-Type: application/json" \
  -b $COOKIE_FILE \
  -d '{
    "status": "delivered"
  }' | json_pp
```

## User Endpoints

### Get Current User

```bash
# Get current user's profile information
curl -s -X GET "$API_URL/users/me" \
  -b $COOKIE_FILE | json_pp
```

### Get All Riders (Admin only)

```bash
# Admin: Get list of all users with rider role
curl -s -X GET "$API_URL/users/riders" \
  -b $COOKIE_FILE | json_pp
```

## Customer-Only Endpoints

### Place an Order (Customer only)

```bash
# Create a new order (must be logged in as customer)
# Replace PRODUCT_ID with an actual product ID
curl -s -X POST "$API_URL/customer/order" \
  -H "Content-Type: application/json" \
  -b $COOKIE_FILE \
  -d '{
    "product_id": "PRODUCT_ID",
    "quantity": 2,
    "selected_size": "M",
    "selected_color": "Black"
  }' | json_pp
```

### Get Customer's Orders

```bash
# Get all orders for the currently logged in customer
curl -s -X GET "$API_URL/customer/orders" \
  -b $COOKIE_FILE | json_pp
```

## Admin-Only Endpoints

### Add New Product (Admin only)

```bash
# Add a new product (must be logged in as admin)
curl -s -X POST "$API_URL/admin/product" \
  -H "Content-Type: application/json" \
  -b $COOKIE_FILE \
  -d '{
    "title": "Premium Hoodie",
    "description": "Soft and warm hoodie for winter",
    "price": 49.99,
    "image": "https://example.com/hoodie.jpg",
    "sizes": ["S", "M", "L", "XL", "XXL"],
    "colors": ["Black", "Navy", "Gray", "Red"],
    "available_quantity": 200
  }' | json_pp
```

### Get All Orders (Admin only)

```bash
# Admin: Get all orders in the system
curl -s -X GET "$API_URL/admin/orders" \
  -b $COOKIE_FILE | json_pp
```

## Testing Flow Example

Here's a complete example of how to test the API flow:

```bash
#!/bin/bash
# Setup
API_URL="http://localhost:5000"
COOKIE_FILE="/tmp/cookie.txt"

# 1. Register as a customer
echo "Registering as customer..."
curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Customer",
    "email": "customer@example.com",
    "password": "password123",
    "role": "customer"
  }' \
  -c $COOKIE_FILE

# 2. View products
echo -e "\n\nViewing products..."
PRODUCTS_RESPONSE=$(curl -s -X GET "$API_URL/products")
echo $PRODUCTS_RESPONSE | json_pp

# Extract first product ID (for demonstration)
PRODUCT_ID=$(echo $PRODUCTS_RESPONSE | jq -r '.data[0]._id')
echo -e "\nSelected product ID: $PRODUCT_ID"

# 3. Create an order
echo -e "\n\nCreating order..."
ORDER_RESPONSE=$(curl -s -X POST "$API_URL/orders" \
  -H "Content-Type: application/json" \
  -b $COOKIE_FILE \
  -d "{
    \"product_id\": \"$PRODUCT_ID\",
    \"quantity\": 1,
    \"selected_size\": \"M\",
    \"selected_color\": \"Black\"
  }")
echo $ORDER_RESPONSE | json_pp

# Extract order ID
ORDER_ID=$(echo $ORDER_RESPONSE | jq -r '.data._id')
echo -e "\nCreated order ID: $ORDER_ID"

# 4. View my orders
echo -e "\n\nViewing my orders..."
curl -s -X GET "$API_URL/orders/me" \
  -b $COOKIE_FILE | json_pp

# 5. Logout
echo -e "\n\nLogging out..."
curl -s -X GET "$API_URL/auth/logout" \
  -b $COOKIE_FILE | json_pp

# 6. Login as admin
echo -e "\n\nLogging in as admin..."
curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }' \
  -c $COOKIE_FILE | json_pp

# 7. View all orders as admin
echo -e "\n\nViewing all orders as admin..."
curl -s -X GET "$API_URL/orders" \
  -b $COOKIE_FILE | json_pp

# 8. Get all riders
echo -e "\n\nGetting all riders..."
RIDERS_RESPONSE=$(curl -s -X GET "$API_URL/users/riders" \
  -b $COOKIE_FILE)
echo $RIDERS_RESPONSE | json_pp

# Extract first rider ID
RIDER_ID=$(echo $RIDERS_RESPONSE | jq -r '.data[0]._id')
echo -e "\nSelected rider ID: $RIDER_ID"

# 9. Assign rider to order
echo -e "\n\nAssigning rider to order..."
curl -s -X PUT "$API_URL/orders/$ORDER_ID/assign" \
  -H "Content-Type: application/json" \
  -b $COOKIE_FILE \
  -d "{
    \"riderId\": \"$RIDER_ID\"
  }" | json_pp

# 10. Logout admin
echo -e "\n\nLogging out admin..."
curl -s -X GET "$API_URL/auth/logout" \
  -b $COOKIE_FILE | json_pp

# 11. Login as rider
echo -e "\n\nLogging in as rider..."
curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "rider1@example.com",
    "password": "password123"
  }' \
  -c $COOKIE_FILE | json_pp

# 12. View assigned orders as rider
echo -e "\n\nViewing assigned orders as rider..."
curl -s -X GET "$API_URL/orders/assigned" \
  -b $COOKIE_FILE | json_pp

# 13. Update order status
echo -e "\n\nUpdating order status to shipped..."
curl -s -X PUT "$API_URL/orders/$ORDER_ID/status" \
  -H "Content-Type: application/json" \
  -b $COOKIE_FILE \
  -d '{
    "status": "shipped"
  }' | json_pp

echo -e "\n\nUpdating order status to delivered..."
curl -s -X PUT "$API_URL/orders/$ORDER_ID/status" \
  -H "Content-Type: application/json" \
  -b $COOKIE_FILE \
  -d '{
    "status": "delivered"
  }' | json_pp

# 14. Logout rider
echo -e "\n\nLogging out rider..."
curl -s -X GET "$API_URL/auth/logout" \
  -b $COOKIE_FILE | json_pp

echo -e "\n\nTest flow completed."
```

## Testing Tips

1. **Session Cookies**: The cURL commands use `-c` to save cookies and `-b` to send cookies. This maintains your session between requests.

2. **JSON Response Formatting**: For better readability, pipe the output through `json_pp` or install `jq` for more advanced JSON processing.

3. **Variable Substitution**: Replace placeholder IDs like `PRODUCT_ID`, `ORDER_ID`, and `RIDER_USER_ID` with actual IDs from your database.

4. **Error Handling**: If you receive "not authenticated" errors, your session may have expired. Log in again to refresh your session.

5. **Role-Based Access**: Make sure you're logged in with the correct role before attempting role-restricted operations.
