import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import env from '../config/env.js';
import sendResponse from '../utils/response.js';


export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    console.log('Registration request:', { name, email, passwordLength: password?.length });
    
    // Validate input
    if (!name || !email || !password) {
      return sendResponse(res, 400, false, 'Name, email, and password are required');
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendResponse(res, 409, false, 'Email is already registered');
    }
    // Create new user with isActive set to true
    const newUser = new User({ 
      name, 
      email, 
      password,
      isActive: true 
    });
    
    console.log('Saving new user...');
    await newUser.save();
    console.log('User saved successfully:', newUser._id);

    sendResponse(res, 201, true, 'User registered successfully', { user: newUser });
  } catch (error) {
    console.error('Registration error details:', error);
    console.error('Error stack:', error.stack);
    sendResponse(res, 500, false, 'An error occurred during registration', { error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return sendResponse(res, 400, false, 'Email and password are required');
    }

    // Find user by email
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return sendResponse(res, 401, false, 'Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      return sendResponse(res, 401, false, 'Account is deactivated. Please contact administrator.');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return sendResponse(res, 401, false, 'Invalid email or password');
    }

    await user.save();

    // Generate token
    const token = jwt.sign({ id: user._id, role: user.role }, env.JWT_SECRET, { expiresIn: '7d' });

    sendResponse(res, 200, true, 'Login successful', {
      token, 
      user: { 
        id: user._id, 
        name: user.name,
        email: user.email, 
        role: user.role,
        isActive: user.isActive 
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    sendResponse(res, 500, false, 'An error occurred during login');
  }
};

// get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    sendResponse(res, 200, true, 'User fetched successfully', { user });
  } catch (error) {
    console.error('Get current user error:', error);
    sendResponse(res, 500, false, 'An error occurred while fetching user data');
  }
};

// Logout user
export const logout = async (req, res) => {
  try {
    sendResponse(res, 200, true, 'Logout successful');
  } catch (error) {
    console.error('Logout error:', error);
    sendResponse(res, 500, false, 'An error occurred during logout');
  }
};