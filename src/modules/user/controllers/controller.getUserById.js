const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");

const getUserById = catchAsync(async (req, res) => {

  const { id } = await pick(req.params, ["id"]);
  const data = await service.getUserById(id);
  if (data) {
    sendResponse(res, httpStatus.OK, data, null);
  } else {
    sendResponse(res, httpStatus.NOT_FOUND, "User not found", {}, "");
  }
});

module.exports = getUserById;
