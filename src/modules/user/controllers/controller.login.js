const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const tokenService = require('../../auth/token.service');
const service = require("../services");


const login = catchAsync(async (req, res) => {

  const { email, password } = await pick(req.body, ["email", "password"]);

  const user = await service.login({ email, password });
  if (!user) {
    return sendResponse(res, httpStatus.BAD_REQUEST, null, "Something went wrong, try again");
  }

  const tokens = await tokenService.generateAuthTokens(user);
  sendResponse(res, httpStatus.OK, { user: user, tokens }, null);
});

module.exports = login;
