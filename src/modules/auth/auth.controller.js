const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const authService= require('./auth.service');
const tokenService = require('./token.service')
const {sendResponse}  = require('../../utils/responseHandler');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/apiErrors');

const register = catchAsync(async (req, res) => {
  const {
    email,
    password,
    name,
    profilePic,
  } = pick(req.body, [
    "email",
    "password",
    "name",
    "profilePic",
  ]);

  const isEmailTaken = await authService.checkEmail(email)
  if (isEmailTaken) {
    throw new ApiError(400, "Email Already Present.")
  }

  const userObj = {
    email,
    password,
    name,
    profilePic
  }
  
  const user = await authService.signup(userObj);
  if(user){
    sendResponse(res, httpStatus.CREATED, user, null)
  }else{
    throw new ApiError(httpStatus.BAD_REQUEST, "User was not registered", false, false)
  }

});



const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
    
    const user = await authService.loginUserWithEmailAndPassword(email, password);
    console.log("user",user);
    
    if(!user){
      return sendResponse(res, httpStatus.FORBIDDEN, null, "Something went wrong, try again");
    }
    
    // sendResponse(res, 200 , { user: user, "tokens":{} }, null);
    const tokens = await tokenService.generateAuthTokens(user);
    sendResponse(res, httpStatus.OK, { user: user, tokens }, null);
});



const getCurrentUser = catchAsync(async (req, res) => {
  try {
    const { token } = req.body;
    const userRes = await authService.getCurrentUser(token);
    if (userRes.status) {
      res.status(httpStatus.OK).json({
        code: httpStatus.OK,
        status:true,
        data: { userData: userRes.userData, profileData:userRes.profileData }
      });
    } else {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        code: httpStatus.INTERNAL_SERVER_ERROR,
        status:false,
        data: 'something went wrong',
      });
    }
  } catch (err) {
    res.status(httpStatus.BAD_REQUEST).json({
      status: httpStatus.BAD_REQUEST,
      data: err.message,
    });
  }
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.status(200).send(tokens);
});

module.exports = {
  register,
  login,
  logout,
//   refreshTokens,
  getCurrentUser,
};
