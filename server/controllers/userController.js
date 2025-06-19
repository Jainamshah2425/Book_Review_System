const User = require('../models/User');
const Review = require('../models/Review');
const Book = require('../models/Book');
const jwt = require('jsonwebtoken');

// Register new user
exports.register = async (req, res) => {
  try {
    const { email, password, username, adminCode } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      email,
      username,
      password,
      // Check admin code against environment variable
      isAdmin: adminCode === process.env.ADMIN_SECRET_CODE
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token with admin status
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Return user data without password
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      bio: user.bio,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt
    };

    res.json({
      message: 'Login successful',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get current user with statistics
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user statistics
    const reviewCount = await Review.countDocuments({ userId: req.userId });
    const uniqueBooksReviewed = await Review.distinct('bookId', { userId: req.userId });
    const averageRating = await Review.aggregate([
      { $match: { userId: req.userId } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    const userStats = {
      totalReviews: reviewCount,
      uniqueBooksReviewed: uniqueBooksReviewed.length,
      averageRating: averageRating.length > 0 ? Math.round(averageRating[0].avgRating * 10) / 10 : 0
    };

    res.json({ ...user.toObject(), stats: userStats });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user profile with reviews
exports.getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user reviews with book details
    const reviews = await Review.find({ userId: id })
      .populate('bookId', 'title author coverImage averageRating')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get user statistics
    const reviewCount = await Review.countDocuments({ userId: id });
    const uniqueBooksReviewed = await Review.distinct('bookId', { userId: id });
    const averageRating = await Review.aggregate([
      { $match: { userId: id } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    const userStats = {
      totalReviews: reviewCount,
      uniqueBooksReviewed: uniqueBooksReviewed.length,
      averageRating: averageRating.length > 0 ? Math.round(averageRating[0].avgRating * 10) / 10 : 0
    };

    res.json({
      user,
      reviews,
      stats: userStats
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user by ID
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { name, bio } = req.body;
    const userId = req.userId;

    // Validate input
    if (name && name.trim().length < 2) {
      return res.status(400).json({ 
        message: 'Name must be at least 2 characters long' 
      });
    }

    if (bio && bio.length > 500) {
      return res.status(400).json({ 
        message: 'Bio must be less than 500 characters' 
      });
    }

    const user = await User.findByIdAndUpdate(
      userId, 
      { name, bio, updatedAt: new Date() }, 
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user reviews
exports.getUserReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const skip = (page - 1) * limit;
    
    const reviews = await Review.find({ userId: id })
      .populate('bookId', 'title author coverImage averageRating')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ userId: id });

    res.json({
      reviews,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: skip + reviews.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
