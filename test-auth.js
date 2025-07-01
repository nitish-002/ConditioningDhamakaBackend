#!/usr/bin/env node

const axios = require('axios');

// Configure axios to handle cookies
const axiosInstance = axios.create({
  baseURL: 'https://conditioningdhamakabackend.onrender.com',
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'Test Script'
  }
});

async function testAuth() {
  try {
    console.log('🔍 Testing authentication flow...\n');

    // 1. Test health endpoint
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await axiosInstance.get('/health');
    console.log('✅ Health check:', healthResponse.data);
    console.log('');

    // 2. Test auth test endpoint
    console.log('2️⃣ Testing /auth/test endpoint...');
    const authTestResponse = await axiosInstance.get('/auth/test');
    console.log('✅ Auth test:', authTestResponse.data);
    console.log('');

    // 3. Test /auth/me without authentication
    console.log('3️⃣ Testing /auth/me without authentication...');
    try {
      const meResponse = await axiosInstance.get('/auth/me');
      console.log('❌ Unexpected success:', meResponse.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Expected 401 error:', error.response.data);
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    console.log('');

    // 4. Test products endpoint (should work without auth)
    console.log('4️⃣ Testing products endpoint...');
    try {
      const productsResponse = await axiosInstance.get('/products');
      console.log('✅ Products accessible:', productsResponse.data.success);
    } catch (error) {
      console.log('❌ Products error:', error.message);
    }
    console.log('');

    console.log('🎉 Basic connectivity tests completed!');
    console.log('📝 To test authentication, you need to:');
    console.log('   1. Have a valid user account in the database');
    console.log('   2. Use the login endpoint with real credentials');
    console.log('   3. Check if session cookies are properly set');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
    }
  }
}

console.log('🚀 Starting authentication tests for deployed backend...\n');
testAuth();
