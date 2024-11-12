const User = require('../user.model');
const ApiError = require('../../../utils/apiErrors');
const httpStatus = require('http-status');
const mongoose = require('mongoose');

const login = async ({ email, password }) => {

    const user = await User.findOne({ email, role: 'user', active: true }).exec();
    if (!user || !(await user.isPasswordMatch(password))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect email or password', false, false);
    }

    await User.updateOne({ _id: new mongoose.Types.ObjectId(user._id) }, { lastLogin: new Date() });

    return user;
};

module.exports = login