const httpStatus = require('http-status');
const tokenService = require('./token.service');
// const Token = require('./token.model');
const User = require('../user/user.model');
const ApiError = require('../../utils/apiErrors');
const { tokenTypes } = require('../../config/tokens');
const mongoose = require('mongoose');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const signup = async (userBody) => {
	const user = await User.create(userBody);
	return user;
};

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {

  let user = await User.findOneAndUpdate({ email, role: 'admin', active: true },{lastLogin:new Date()}).exec();

  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Incorrect email or password', false, false);
  }
  if (user.inActive) {
    throw new ApiError(httpStatus.FORBIDDEN, 'This account is deactivated. Please contact your administrator for assistance.', false, false);
  }
    const userWithoutPassword = { ...user._doc };
    delete userWithoutPassword.password;
    return userWithoutPassword
};


/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};



/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await User.findById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    return tokenService.generateAccessToken(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

//Check email if is already taken
const checkEmail = async (email) => {
  return await User.findOne({ email: email });
};

/**
 * Get current User data
 * @param {string} token
 * @returns {Promise}
 */
const getCurrentUser = async (token) => {
  try {
    // const { user } = await tokenService.verifyToken(token, tokenTypes.ACCESS);
    const { user } = await tokenService.verifyToken(token, tokenTypes.REFRESH);
    const userData = await User.findOne({ _id: new mongoose.Types.ObjectId(user._id), active: true });
    if (!userData) {
      return { status: false, message: 'User not found' };
    }
    const userDataWithoutPassword = { ...userData._doc };
    delete userDataWithoutPassword.password;
    return { userData: userDataWithoutPassword, status: true };
  } catch (error) {
    console.log("--------------------- getCurrentUser ---------------------------", { error: error.message });
    return { userData: null, profileData: null, status: false }
  }
};


module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  getCurrentUser,
  checkEmail,
  signup
};
