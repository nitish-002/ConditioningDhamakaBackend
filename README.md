# Conditioning Dhamaka Backend

## Overview
This is a backend application built with Express.js and MongoDB, providing APIs for user management and authentication.

## Technology Stack
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT for authentication
- Bcrypt for password hashing

## Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup Instructions

1. Clone the repository
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
- Copy `.env.example` to `.env`
- Update the variables as needed

4. Start the server
```bash
npm start
```

For development:
```bash
npm run dev
```

## Environment Variables
Check `.env.example` file for required environment variables.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify` - Verify email address

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## Error Handling
The API uses standard HTTP status codes and returns error messages in JSON format.

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
